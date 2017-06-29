// @flow
/* eslint-disable no-duplicate-imports */
import invariant from 'invariant';
import R from 'ramda';
import { Reference } from 'firebase/database';
import Observable from './Observable';
import type { Observer } from './Observable';

interface LiveQuery {
  subscribe(observer: Observer<*>): () => void,
}

/*
 * A live query for a leaf value of the Firebase database.
 */
class LeafLiveQuery implements LiveQuery {
  ref: Reference;
  value: any;
  _observable: Observable<any>;
  isActive: boolean;
  _handleValueSnapshot: (snapshot: any) => void;
  transform: (value: any) => any;

  constructor(ref: Reference, transform: (value: any) => any = x => x) {
    invariant(
      ref && ref instanceof Reference,
      'Must supply a Firebase reference',
    );
    this.ref = ref;
    this.value = null;
    this._observable = new Observable();
    this.isActive = false;
    this.transform = transform;

    this._handleValueSnapshot = this._handleValueSnapshot.bind(this);
  }

  async execute() {
    try {
      // Attempt to access the ref to check if we have permission
      await this.ref.once('value');
      this.ref.on('value', this._handleValueSnapshot);
      this.isActive = true;
    } catch (err) {
      this._observable.error(err);
    }
  }

  cancel() {
    this.ref.off('value', this._handleValueSnapshot);
    this.isActive = false;
    this._observable.complete();
  }

  subscribe(observer: Observer<any>) {
    if (!this.isActive) {
      this.execute();
    }
    const unsubscribe = this._observable.subscribe(observer);
    return () => {
      unsubscribe();
      if (this._observable._observers.size === 0 && this.isActive) {
        this.cancel();
      }
    };
  }

  _handleValueSnapshot(snapshot: any) {
    this.value = this.transform(snapshot.val());
    this._observable.next(this.value);
  }
}

type _ObjectLiveQueryChild = {
  subscription: LiveQuery,
  unsubscribe: () => void,
};

/**
 * A container for other nested live queries, returning its value as a structured object.
 */
class ObjectLiveQuery implements LiveQuery {
  ref: Reference;
  children: Map<string, _ObjectLiveQueryChild>;
  value: { [prop: string]: any };
  _observable: Observable<any>;
  isActive: boolean;

  constructor(ref: Reference, children: { [name: string]: LiveQuery }) {
    this.ref = ref;
    this.children = new Map();
    this.value = {};
    this._observable = new Observable();
    this.isActive = false;

    Object.entries(children).forEach(([key, subscription]) => {
      this.value[key] = null;
      this.children.set(key, ({ subscription, unsubscribe: () => {} }: any));
    });
  }

  execute() {
    [...this.children.entries()].forEach(([key, child]) => {
      const observer = {
        next: value => this._handleChildValue(key, value),
        error: err => {
          this._observable.error(err);
        },
        complete: () => {}, // TODO
      };
      child.unsubscribe = child.subscription.subscribe(observer);
    });
  }

  cancel() {
    [...this.children.values()].forEach(child => {
      child.unsubscribe();
    });
    this.isActive = false;
    this._observable.complete();
    // complete observers
  }

  subscribe(observer: Observer<any>) {
    if (!this.isActive) {
      this.execute();
    }
    const unsubscribe = this._observable.subscribe(observer);
    return () => {
      unsubscribe();
      if (this._observable._observers.size === 0 && this.isActive) {
        this.cancel();
      }
    };
  }

  _handleChildValue(key: string, value: any) {
    this.value = Object.assign({}, this.value, { [key]: value });
    this._observable.next(this.value);
  }
}

type _ListSubscriptionChild = {
  subscription: any,
  unsubscribe: () => void,
  key: number | string,
  value: any,
};

/**
 * A container for other live queries, created dynamically for each child of the
 * reference, returns its value as an ordered list.
 */
class ListLiveQuery implements LiveQuery {
  ref: Reference;
  value: Array<any>;
  _observable: Observable<any>;
  isActive: boolean;
  makeChildSubscription: (ref: Reference) => LiveQuery;
  children: Map<string | number, _ListSubscriptionChild>;
  _handleChildAdded: (snapshot: any) => void;
  _handleChildRemoved: (snapshot: any) => void;

  constructor(ref: Reference, makeChildSubscription: (ref: Reference) => any) {
    this.ref = ref;
    this.children = new Map();
    this.value = [];
    this._observable = new Observable();
    this.makeChildSubscription = makeChildSubscription;
    this.isActive = false;

    this._handleChildAdded = this._handleChildAdded.bind(this);
    this._handleChildRemoved = this._handleChildRemoved.bind(this);
  }

  async execute() {
    // This will only work when the client has read access to the list and all children
    try {
      await this.ref.once('value');
      this.ref.on('child_added', this._handleChildAdded);
      this.ref.on('child_removed', this._handleChildRemoved);
    } catch (err) {
      this._observable.error(err);
    }
  }

  cancel() {
    [...this.children.values()].forEach(child => {
      child.unsubscribe();
    });
    this.ref.off('child_added', this._handleChildAdded);
    this.ref.off('child_removed', this._handleChildRemoved);
    this.isActive = false;
    this._observable.complete();
  }

  subscribe(observer: Observer<any>) {
    if (!this.isActive) {
      this.execute();
    }
    const unsubscribe = this._observable.subscribe(observer);
    return () => {
      unsubscribe();
      if (this._observable._observers.size === 0 && this.isActive) {
        this.cancel();
      }
    };
  }

  _handleChildAdded(snapshot: any) {
    const key = snapshot.key;
    const subscription = this.makeChildSubscription(this.ref.child(key));
    const unsubscribe = subscription.subscribe({
      next: value => this._handleChildValue(key, value),
      error: err => this._observable.error(err),
      complete: () => {}, // TODO
    });
    this.children.set(key, { subscription, unsubscribe, key, value: null });
  }

  _handleChildValue(key: string | number, value: any) {
    if (value === null) {
      // The child was removed, it will be handled by the 'child_removed' event
      return;
    }
    const child = (this.children.get(key): any);
    child.value = value;
    this.value = R.sortBy(R.prop('key'), [...this.children.values()])
      .map(R.prop('value'))
      .filter(value => value !== null);
    this._observable.next(this.value);
  }

  _handleChildRemoved(snapshot: any) {
    const key = snapshot.key;
    const { unsubscribe } = (this.children.get(key): any);
    unsubscribe();
    this.children.delete(key);
    this.value = R.sortBy(R.prop('key'), [...this.children.values()])
      .map(R.prop('value'))
      .filter(value => value !== null);
    this._observable.next(this.value);
  }
}

/**
 * A live query that takes it's value from some other part of the firebase database, where
 * the path is based on the leaf value of the given reference
 */
class RedirectLiveQuery implements LiveQuery {
  ref: Reference;
  value: Array<any>;
  _observable: Observable<any>;
  isActive: boolean;
  makeChildSubscription: (ref: Reference, value: any) => LiveQuery;
  child: { subscription: any, unsubscribe: () => void };
  _handleChildValue: (value: any) => void;
  _handleValueSnapshot: (snapshot: any) => void;

  constructor(
    ref: Reference,
    makeChildSubscription: (ref: Reference, value: any) => any,
  ) {
    this.ref = ref;
    this.child = { subscription: null, unsubscribe: () => {} };
    this.value = [];
    this._observable = new Observable();
    this.makeChildSubscription = makeChildSubscription;
    this.isActive = false;

    this._handleChildValue = this._handleChildValue.bind(this);
    this._handleValueSnapshot = this._handleValueSnapshot.bind(this);
  }

  async execute() {
    // This will only work when the client has read access to the list and all children
    try {
      await this.ref.once('value');
      this.ref.on('value', this._handleValueSnapshot);
    } catch (err) {
      this._observable.error(err);
    }
  }

  cancel() {
    this.child.unsubscribe();
    this.child = { subscription: null, unsubscribe: () => {} };
    this.ref.off('value', this._handleValueSnapshot);
    this.isActive = false;
    this._observable.complete();
  }

  subscribe(observer: Observer<any>) {
    if (!this.isActive) {
      this.execute();
    }
    const unsubscribe = this._observable.subscribe(observer);
    return () => {
      unsubscribe();
      if (this._observable._observers.size === 0 && this.isActive) {
        this.cancel();
      }
    };
  }

  _handleValueSnapshot(snapshot: any) {
    const value = snapshot.val();
    if (this.child) {
      this.child.unsubscribe();
    }
    const subscription = this.makeChildSubscription(this.ref, value);
    const unsubscribe = subscription.subscribe({
      next: this._handleChildValue,
      error: err => this._observable.error(err),
      complete: () => {}, // TODO
    });
    this.child = { subscription, unsubscribe };
  }

  _handleChildValue(value: any) {
    this.value = value;
    this._observable.next(this.value);
  }
}

export { LeafLiveQuery, ObjectLiveQuery, ListLiveQuery, RedirectLiveQuery };

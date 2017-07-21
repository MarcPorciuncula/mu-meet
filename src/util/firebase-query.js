// @flow
import Observable from './subscriptions/Observable';
import { Reference, DataSnapshot } from 'firebase/database';
import invariant from 'invariant';

// Represents a value that while exists, is not known yet.
const PENDING = Symbol('pending');
const isPending = value => value === PENDING;

// Transforms a Firebase snapshot into the value that will be dispatched
type ResolverFn = (snapshot: DataSnapshot) => any;

// The default resolver, which just returns the value of the snapshot.
const value = snapshot => snapshot.val();

interface Query {
  active: boolean,
  subscribe(observer: *): () => void,
  execute(): void,
  cancel(): void,
}

type QueryFactory = (ref: Reference, key: string) => Query;

/**
 * An observable Firebase database live query.
 */
class LeafQuery implements Query {
  _observable: Observable<any>;
  _resolve: ResolverFn;
  _nullable: boolean;
  ref: Reference;
  active: boolean;

  _update: (snapshot: DataSnapshot) => void;
  _error: (err: Error) => void;

  constructor(
    ref: Reference,
    {
      resolve = value,
      nullable = false,
    }: { resolve?: ResolverFn, nullable?: boolean } = {},
  ) {
    this._observable = new Observable();
    this._resolve = resolve;
    this._nullable = nullable;
    this.ref = ref;
    this.active = false;

    this._update = this._update.bind(this);
    this._error = this._error.bind(this);
  }

  subscribe(observer: *) {
    return this._observable.subscribe(observer);
  }

  execute() {
    if (this.active) return;

    this.active = true;
    this.ref.on('value', this._update, this._error);
  }

  cancel() {
    if (!this.active) return;

    this.active = false;
    this.ref.off('value', this._update, this._error);
    this._observable.complete();
  }

  _update(snapshot: DataSnapshot) {
    let value = this._resolve(snapshot);

    invariant(
      typeof value !== 'undefined',
      'The resolver for a query on ref %s returned "undefined". ' +
        'You must use "null" to signal non values',
      this.ref.toString(),
    );

    // If this field is not nullable, then its deletion shouldn't cause an update.
    // This stops the deletion of leaf nodes causing null updates preceeding a child_removed
    if (!this._nullable && value === null) {
      value = PENDING;
    }

    this._observable.next(value);
  }

  _error(error: Error) {
    this._observable.error(error);
  }
}

/**
 * A container for unique nested live queries, returning their values as a structured
 * object.
 */
class ObjectQuery implements Query {
  _observable: Observable<any>;
  _children: Map<string, Query>;
  _value: { [key: string]: any };
  ref: Reference;
  active: boolean;

  _update: (key: string, value: any) => void;

  constructor(
    ref: Reference,
    children: { [key: string]: Query | QueryFactory },
    options: {} = {},
  ) {
    this._observable = new Observable();
    this._children = new Map();
    this._value = {};
    this.ref = ref;
    this.active = false;

    this._update = this._update.bind(this);

    for (const key in children) {
      let query = children[key];

      // The query may be a factory function,
      if (typeof query === 'function') {
        query = query(ref, key);
      }

      // Initialise an empty value for this child.
      this._value[key] = PENDING;

      query.subscribe({
        next: value => this._update(key, value),
        error: err => this._observable.error(err),
        complete: () =>
          invariant(
            !this.active,
            'Child query was completed while the parent query was active. ' +
              'Only cancel queries from the root.',
          ),
      });

      this._children.set(key, query);
    }
  }

  subscribe(observer: *) {
    return this._observable.subscribe(observer);
  }

  execute() {
    if (this.active) return;

    this.active = true;
    const queries = [...this._children.values()];
    queries.forEach(query => {
      query.execute();
    });
  }

  cancel() {
    if (!this.active) return;

    this.active = false;
    const children = [...this._children.values()];
    children.forEach(query => {
      query.cancel();
    });
    this._observable.complete();
  }

  getChild(key: string) {
    return this._children.get(key) || null;
  }

  _update(key: string, value: any) {
    this._value = Object.assign({}, this._value, { [key]: value });
    // Only dispatch a value once we have received
    // a value for every child at least once
    if (Object.values(this._value).some(isPending)) return;
    this._observable.next(this._value);
  }

  _error(err: Error) {
    this._observable.error(err);
  }
}

/**
 * A container for homogenous nested live queries,
 * child queries are created and deleted dynamically and
 * their values are returned as an ordered list.
 */
class ListQuery implements Query {
  _observable: Observable<any>;
  _keys: Array<string>;
  _children: Array<Query>;
  _value: Array<any>;
  _childFactory: QueryFactory;
  ref: Reference;
  active: boolean;

  _update: () => void;
  _error: () => void;
  _handleChildAdded: (snapshot: DataSnapshot, prevKey: string) => void;
  _handleChildRemoved: (snapshot: DataSnapshot) => void;

  constructor(ref: Reference, childFactory: QueryFactory, options: {} = {}) {
    this._observable = new Observable();
    this._keys = [];
    this._children = [];
    this._value = [];
    this._childFactory = childFactory;
    this.ref = ref;
    this.active = false;

    this._update = this._update.bind(this);
    this._error = this._error.bind(this);
    this._handleChildAdded = this._handleChildAdded.bind(this);
    this._handleChildRemoved = this._handleChildRemoved.bind(this);
  }

  subscribe(observer: *) {
    return this._observable.subscribe(observer);
  }

  execute() {
    if (this.active) return;

    this.active = true;
    this.ref.on('child_added', this._handleChildAdded, this._error);
    // TODO child_moved
    this.ref.on('child_removed', this._handleChildRemoved, this._error);
  }

  cancel() {
    if (!this.active) return;

    this.active = false;
    this.ref.off('child_added', this._handleChildAdded, this._error);
    this.ref.off('child_removed', this._handleChildRemoved, this._error);
    this._children.forEach(child => child.cancel());
    this._observable.complete();
  }

  getChild(key: string) {
    const index = this._keys.indexOf(key);
    return index !== -1 ? this._children[index] : null;
  }

  _update() {
    // Only dispatch a value once we have received
    // a value for every child at least once
    if (!this._value.some(isPending)) {
      this._observable.next(this._value);
    }
  }

  _error(err: Error) {
    this._observable.error(err);
  }

  _handleChildAdded(snapshot: DataSnapshot, prevKey: string | null) {
    const { key } = snapshot;

    const query = this._childFactory(this.ref, key);
    query.subscribe({
      next: value => this._handleChildValue(value, prevKey),
      error: err => this._observable.error(err),
      complete: () => {}, // TODO not sure what this would even mean
    });
    query.execute();

    const index = prevKey ? this._keys.indexOf(prevKey) + 1 : 0;
    this._keys.splice(index, 0, key);
    this._children.splice(index, 0, query);
    this._value.splice(index, 0, PENDING);
  }

  _handleChildValue(value: any, prevKey: string | null) {
    const index = prevKey ? this._keys.indexOf(prevKey) + 1 : 0;
    this._value.splice(index, 1, value);
    this._update();
  }

  _handleChildRemoved(snapshot: DataSnapshot) {
    const { key } = snapshot;

    const index = this._keys.indexOf(key);
    if (index !== -1) {
      const child = this._children[index];
      child.cancel();
      this._keys.splice(index, 1);
      this._children.splice(index, 1);
      this._value.splice(index, 1);
    }
  }
}

/**
 * A query that uses the value as a fragment of the path to the wanted value
 */
class RedirectQuery implements Query {
  _observable: Observable<any>;
  _child: Query;
  _resolve: ResolverFn;
  _childFactory: QueryFactory;
  ref: Reference;
  active: boolean;

  _update: (value: any) => void;
  _error: (err: Error) => void;
  _updateTarget: (snapshot: DataSnapshot) => void;

  constructor(
    ref: Reference,
    childFactory: QueryFactory,
    { resolve = value }: { resolve?: ResolverFn } = {},
  ) {
    this._observable = new Observable();
    this._resolve = resolve;
    this._childFactory = childFactory;
    this.ref = ref;
    this.active = false;

    this._update = this._update.bind(this);
    this._error = this._error.bind(this);
    this._updateTarget = this._updateTarget.bind(this);
  }

  subscribe(observer: *) {
    return this._observable.subscribe(observer);
  }

  execute() {
    if (this.active) return;

    this.active = true;
    this.ref.on('value', this._updateTarget, this._error);
  }

  cancel() {
    if (!this.active) return;

    this.active = false;
    this.ref.off('value', this._updateTarget, this._error);
    this._observable.complete();
  }

  _update(value: any) {
    if (isPending(value)) return;
    this._observable.next(value);
  }

  _error(err: Error) {
    this._observable.error(err);
  }

  _updateTarget(snapshot: DataSnapshot) {
    if (this._child) {
      this._child.cancel();
    }

    const target = this._resolve(snapshot);
    if (target === null) {
      this._observable.next(null);
      return;
    }

    const query = this._childFactory(this.ref, target);
    query.subscribe({
      next: this._update,
      error: err => this._observable.error(err),
      complete: () => {},
    });
    query.execute();
    this._child = query;
  }
}

export { LeafQuery, ObjectQuery, ListQuery, RedirectQuery };

export default {
  Leaf: LeafQuery,
  Object: ObjectQuery,
  List: ListQuery,
  Redirect: RedirectQuery,
};

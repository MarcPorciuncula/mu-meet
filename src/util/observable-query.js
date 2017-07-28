// @flow
import { Observable } from 'rxjs-es/Observable';
import 'rxjs-es/add/operator/map';
import 'rxjs-es/add/operator/filter';
import 'rxjs-es/add/operator/merge';
import 'rxjs-es/add/operator/scan';
import 'rxjs-es/add/operator/zipAll';
import 'rxjs-es/add/observable/zip';
import type { Reference } from 'firebase/database';
import { zipObj } from 'ramda';

function snap(ref: Reference) {
  return Observable.create(observer => {
    const update = snapshot => observer.next(snapshot);
    const error = err => observer.error(err);

    ref.on('value', update, error);

    return () => ref.off('value', update, error);
  });
}

function val(ref: Reference, { nullable = false }: * = {}) {
  return snap(ref)
    .map(snapshot => snapshot.val())
    .filter(value => (nullable ? true : value !== null));
}

type ObservableMap = {
  [key: string]: Observable,
};

type ObservableFactoryMap = {
  [key: string]: (ref: Reference) => Observable,
};

type ObservableFactoryMapFactory = (
  ref: Reference,
) => ObservableFactoryMap | ObservableMap;

function shape(
  ref: Reference,
  children: ObservableFactoryMapFactory | ObservableFactoryMap | ObservableMap,
) {
  // ObservableFactoryMapFactory -> ObservableFactoryMap | ObservableMap
  if (typeof children === 'function') {
    children = children(ref);
  }

  // ObservableFactoryMap -> ObservableMap
  if (typeof children[Object.keys(children)[0]] === 'function') {
    for (const key in children) {
      children[key] = children[key](ref);
    }
  }

  const keys = Object.keys(children);
  const observables = Object.values(children);

  return Observable.zip(...observables)
    .filter(values => !values.some(value => typeof value === 'undefined'))
    .map(values => zipObj(keys, values));
}

type KeyedObservableFactory = (ref: Reference, key: string) => Observable;

function list(ref: Reference, factory: KeyedObservableFactory) {
  const added = Observable.create(observer => {
    const error = err => observer.error(err);
    const handler = (snapshot, prev) => observer.next({ snapshot, prev });

    ref.on('child_added', handler, error);

    return () => ref.off('child_added', handler, error);
  });

  const removed = Observable.create(observer => {
    const error = err => observer.error(err);
    const handler = (snapshot, prev) => observer.next({ snapshot, prev });

    ref.on('child_removed', handler, error);

    return () => ref.off('child_removed', handler, error);
  });

  const events = Observable.create(() => {})
    .merge(added.map(val => Object.assign({}, val, { type: 'added' })))
    .merge(removed.map(val => Object.assign({}, val, { type: 'removed' })));

  const children = events.scan((children, event) => {
    const index = event.prev
      ? children.findIndex(child => child.key === event.prev)
      : 0;
    const result = children.slice();

    if (event.type === 'added') {
      result.splice(index, 0, event.snapshot);
    }
    if (event.type === 'removed') {
      result.splice(index, 1);
    }

    return result;
  }, []);

  return children
    .map(children => {
      console.log(children);
      return children.map(child => factory(ref, child.key));
    })
    .zipAll();
}

export { snap, val, shape, list };

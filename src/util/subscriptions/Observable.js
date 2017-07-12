// @flow
import invariant from 'invariant';

export type Observer<T> = {
  next: (value: T) => void,
  error: (err: Error) => void,
  complete: () => void,
};

class Observable<T> {
  _observers: Set<Observer<T>>;

  constructor() {
    this._observers = new Set();
  }

  subscribe(observer: Observer<T>) {
    invariant(observer, 'expected an observer, got %s', observer);
    invariant(
      typeof observer.next === 'function',
      'expected observer to have `next` handler, got %s',
      observer.next,
    );
    invariant(
      typeof observer.error === 'function',
      'expected observer to have `error` handler, got %s',
      observer.error,
    );
    invariant(
      typeof observer.complete === 'function',
      'expected observer to have `complete` handler, got %s',
      observer.complete,
    );
    this._observers.add(observer);
    return () => this._unsubscribe(observer);
  }

  _unsubscribe(observer: Observer<T>) {
    this._observers.delete(observer);
  }

  next(value: T) {
    this._observers.forEach(observer => {
      observer.next(value);
    });
  }

  error(err: Error) {
    this._observers.forEach(observer => {
      observer.error(err);
    });
  }

  complete() {
    this._observers.forEach(observer => {
      observer.complete();
      this._unsubscribe(observer);
    });
  }
}

export default Observable;

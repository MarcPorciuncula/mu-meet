// @flow weak
// Provides a set of utility functions for easily creating resolvers for a
// Firebase/GraphQL schema.
// They work assuming the root value is either a database reference, or a JSON structure
// mirroring the database. This way, you can either lazily pick and fetch only the leaf
// paths you need, or if you have already fetched the entire structure at a path,
// you can query it using GraphQL syntax.

import { path as access } from 'ramda';
import database from 'firebase/database';

const Reference = database.Reference;

export function leaf(path): (ref: any) => Promise<any> {
  return val => {
    if (val instanceof Reference) {
      return val.child(path).once('value').then(s => s.val());
    } else {
      return Promise.resolve(child(path)(val));
    }
  };
}

export function getKey(val): string {
  if (val instanceof Reference) {
    return val.key;
  } else {
    return val._key;
  }
}

export function child(path): any {
  return val => {
    if (val instanceof Reference) {
      return val.child(path);
    } else {
      const result = access(path.split('/'))(val);
      if (typeof result === 'object' && result !== null) {
        Object.assign(result, { _key: path.match(/.*(^|\/)([^/]+?)$/)[2] });
      }
      return result;
    }
  };
}

export function doesExist(
  checkPath,
): (val: Reference | any) => Promise<Boolean> {
  return async val => {
    if (val instanceof Reference) {
      return !!await leaf(checkPath)(val);
    } else {
      return !!checkPath;
    }
  };
}

export function getRoot(val, args, context, info): any {
  if (val instanceof Reference) {
    return val.root;
  } else {
    return context.root;
  }
}

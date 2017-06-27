import { execute, parse, validate, specifiedRules } from 'graphql';
import schema from './schema';
import invariant from 'invariant';

class GraphQLErrors extends Error {
  constructor(errors) {
    super(errors.map(err => err.message).join('\n'));
    this.errors = errors;
  }
}

export async function query({ query: queryString, vars = {}, root }) {
  invariant(queryString);
  invariant(root, 'Must supply root ref');
  const doc = parse(queryString);
  const errors = validate(schema, doc, specifiedRules);
  if (errors.length) {
    if (errors.length === 1) {
      throw errors[0];
    } else {
      throw new GraphQLErrors(errors);
    }
  }
  const result = await execute(
    schema,
    doc,
    root,
    {} /* context */,
    vars,
    /* operationName */
  );

  return result;
}

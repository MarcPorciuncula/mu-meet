import { execute, parse, validate, specifiedRules } from 'graphql';
import schema from './schema';
import invariant from 'invariant';

class ValidationError extends Error {
  errors: Array<Error>;
  message: string;

  constructor(errors) {
    super();
    this.errors = errors;
    this.message = 'GraphQL query has validation errors';
  }
}

// Queries the Firebase database according to the GraphQL schema defined in ./schema.js
// The root can either be a root database reference or a JSON object that mirrors the
// structure of the Firebase database
export async function query({ query: queryString, vars = {}, root }) {
  invariant(queryString, 'must supply querystring');
  invariant(root, 'Must supply root ref or database object');

  const doc = parse(queryString);
  const errors = validate(schema, doc, specifiedRules);
  if (errors.length) {
    throw new ValidationError(errors);
  }

  const result = await execute(
    schema,
    doc,
    root,
    { root } /* context */,
    vars,
    /* operationName */
  );

  return result;
}

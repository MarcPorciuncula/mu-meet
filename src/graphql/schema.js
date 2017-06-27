import { makeExecutableSchema } from 'graphql-tools';
import types from './types';
import resolvers from './resolvers';

const schema = makeExecutableSchema({
  typeDefs: types,
  resolvers,
  logger: { log: err => console.error(err) },
  allowUndefinedInResolve: false,
  resolverValidationOptions: {
    requireResolversForArgs: true,
    requireResolversForNonScalar: true,
  },
});

export default schema;

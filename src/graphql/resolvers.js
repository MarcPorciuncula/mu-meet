// @flow weak
// Contains resolver functions for the GraphQL schema types defined in schema.js
// Maps these types to their actual Firebase database locations

import { compose } from 'ramda';
import { GraphQLScalarType, Kind } from 'graphql';
import { leaf, getKey, child, doesExist, getRoot } from './resolver-utils';

const GraphQLDateType = new GraphQLScalarType({
  name: 'Date',
  // String to date
  serialize(date) {
    return new Date(date);
  },
  // FIXME not sure which way this is supposed to convert
  parseValue(date) {
    console.log('parseValue', date);
    return date.toString();
  },
  // FIXME not sure which way this is supposed to convert
  parseLiteral(ast) {
    console.log('parseLiteral', ast);
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

const Session = {
  id: getKey,
  startedAt: leaf('startedAt'),
  config: child('config'),
  host: async ref => {
    const id = await leaf('host')(ref);
    return compose(child(`/users/${id}`), getRoot)(ref);
  },
  users: async ref => {
    const ids = Object.keys(await leaf('users')(ref));
    const root = getRoot(ref);
    return Promise.all(ids.map(id => child(`/users/${id}`)(root)));
  },
  result: (ref, vars, context, info) => {
    return child('result')(ref);
  },
};

const SessionConfig = {
  days: leaf('days'),
  minDuration: leaf('minDuration'),
  searchFromDate: leaf('searchFromDate'),
  searchToDate: leaf('searchToDate'),
  searchFromHour: leaf('searchFromHour'),
  searchToHour: leaf('searchToHour'),
  timezoneOffset: leaf('timezoneOffset'),
};

const SessionResult = {
  pending: leaf('pending'),
  meetings: async ref => {
    return (await leaf('meetings')(ref)) || [];
  },
};

const User = {
  id: getKey,
  profile: child('profile'),
};

const UserProfile = {
  email: leaf('email'),
  givenName: leaf('given_name'),
  picture: leaf('picture'),
};

const Query = {
  async session(ref, args, context, info) {
    const session = child(`sessions/${args.id}`)(ref);

    // We're using startedAt as an existence check, but maybe use an _exists field or something
    const exists = await doesExist('startedAt')(session);

    return exists ? session : null;
  },
};

const resolvers = {
  Date: GraphQLDateType,
  Session,
  SessionConfig,
  SessionResult,
  User,
  UserProfile,
  Query,
};

export default resolvers;

// @flow weak
// Contains resolver functions for the GraphQL schema types defined in schema.js
// Maps these types to their actual Firebase database locations

import { GraphQLScalarType, Kind } from 'graphql';
import { leaf, child } from './resolver';

const GraphQLDateType = new GraphQLScalarType({
  name: 'Date',
  serialize(date) {
    return new Date(date);
  },
  parseValue(date) {
    return date.toString();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }
    if (ast.kind === Kind.INT || ast.kind === Kind.FLOAT) {
      return new Date(ast.value).toString();
    }
    return null;
  },
});

const Session = {
  // id: getKey,
  startedAt: leaf('startedAt'),
  config: child('config'),
  host: (ref, args, context, info) => {
    if (context.isSubscription) {
      return {
        source: leaf('host')(ref, args, context, info),
        target: value => {
          return context.root.child('/users/' + value);
        },
      };
    }
    return leaf('host')(ref, args, context, info).then(id =>
      child(`/users/${id}`)(context.root, args, context, info),
    );
  },
  users: () => null,
  // users: async ref => {
  //   const ids = Object.keys(await leaf('users')(ref));
  //   const root = getRoot(ref);
  //   return Promise.all(ids.map(id => child(`/users/${id}`)(root)));
  // },
  result: child('result'),
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
  meetings: leaf('meetings'),
};

const User = {
  // id: getKey,
  profile: child('profile'),
};

const UserProfile = {
  email: leaf('email'),
  givenName: leaf('given_name'),
  picture: leaf('picture'),
};

const Query = {
  session(ref, args, context, info) {
    const sessionRef = child(`sessions/${args.id}`)(ref, args, context);
    return sessionRef;
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

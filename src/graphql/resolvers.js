// @flow weak
import { compose } from 'ramda';
import { GraphQLScalarType, Kind } from 'graphql';

function leaf(path): (ref: any) => Promise<any> {
  return ref => ref.child(path).once('value').then(s => s.val());
}

function getKey(ref): string {
  return ref.key;
}

function child(path): any {
  return ref => ref.child(path);
}

function getRoot(ref): any {
  return ref.root;
}

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

const resolvers = {
  Session: {
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
    result: child('result'),
  },
  SessionConfig: {
    days: leaf('days'),
    minDuration: leaf('minDuration'),
    searchFromDate: leaf('searchFromDate'),
    searchToDate: leaf('searchToDate'),
    searchFromHour: leaf('searchFromHour'),
    searchToHour: leaf('searchToHour'),
    timezoneOffset: leaf('timezoneOffset'),
  },
  SessionResult: {
    pending: leaf('pending'),
    meetings: async ref => {
      return (await leaf('meetings')(ref)) || [];
    },
  },
  User: {
    id: getKey,
    profile: child('profile'),
  },
  UserProfile: {
    email: leaf('email'),
    givenName: leaf('given_name'),
    picture: leaf('picture'),
  },
  Query: {
    async session(ref, args, context, info) {
      const sessionRef = ref.child(`sessions/${args.id}`);

      // We're using startedAt as an existence check, but maybe use an _exists field or something
      const exists = await leaf('startedAt')(sessionRef);

      // Exists will be null if there was nothing at the path
      return exists && sessionRef;
    },
  },
  Date: GraphQLDateType,
};

export default resolvers;

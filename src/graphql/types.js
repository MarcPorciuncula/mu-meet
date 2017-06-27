const types = gql`
scalar Date

type User {
  id: ID!
  profile: UserProfile!
}

type UserProfile {
  email: String!
  givenName: String!
  picture: String!
}

type Session {
  id: ID!
  startedAt: Date!
  config: SessionConfig!
  host: User!
  users: [User!]!
  result: SessionResult!
}

type SessionConfig {
  days: [Boolean!]!
  minDuration: Float!
  searchFromDate: Date!
  searchToDate: Date!
  searchFromHour: Float!
  searchToHour: Float!
  timezoneOffset: Float!
}

type SessionResult {
  pending: Boolean!
  meetings: [Meeting!]!
}

type Meeting {
  duration: Float! # Duration in minutes
  end: Date!
  start: Date!
}

type Query {
  session(id: ID!): Session
}

schema {
  query: Query
}
`;

export default types;

import { gql } from 'apollo-server-express';
import { nonDemoMode } from './directiveResolvers';

const typeDefs = gql`
  directive @nonDemoMode on FIELD_DEFINITION

  type Query {
    _: String!
  }

  type Mutation {
    _: String!
  }

  type Subscription {
    _: String!
  }
`;

const directives = {
  nonDemoMode,
};

module.exports = {
  typeDefs,
  directives,
};

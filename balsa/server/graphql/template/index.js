import { gql } from 'apollo-server-express';
import { Template } from '../../entities/template';

const typeDefs = gql`
  extend type Query {
    templates: [Template]
  }
  type Template {
    id: Int
    name: String
    content: String
  }
`;

const resolvers = {
  Query: {
    templates: async () => {
      return await Template.find();
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};

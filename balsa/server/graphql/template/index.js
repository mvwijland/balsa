import { gql } from 'apollo-server-express';
import { Template } from '../../entities/template';
import { TemplateCategory } from '../../entities/templateCategory';
import { Conversation } from '../../entities/conversation';

const typeDefs = gql`
  extend type Query {
    templates(categoryId: Int): [Template]
    templateCategories: [TemplateCategory]
  }
  type Template {
    id: Int
    name: String
    content: String
  }

  type TemplateCategory {
    id: Int
    name: String
  }
`;

const resolvers = {
  Query: {
    templates: async (_, { categoryId }, context) => {
      let qb = Template.getRepository().createQueryBuilder('template');
      if (categoryId) {
        qb.leftJoinAndSelect('template.categories', 'categories').where('categories.id = :categoryId ', { categoryId });
      }
      return await qb.getMany();
    },
    templateCategories: async () => {
      return await TemplateCategory.find();
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};

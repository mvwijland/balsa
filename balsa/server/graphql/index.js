import { ApolloServer } from 'apollo-server-express';
import { merge } from 'lodash';
import { directives as BaseDirectives, typeDefs as BaseType } from './base';
import { directives as AuthDirectives, resolvers as AuthResolvers, typeDefs as AuthTypes } from './auth';
import { resolvers as FileResolvers, typeDefs as FileTypes } from './file';
import { resolvers as SpreadsheetResolvers, typeDefs as SpreadsheetTypes } from './spreadsheet';
import { resolvers as FolderResolvers, typeDefs as FolderTypes } from './folder';
import { resolvers as ConfigResolvers, typeDefs as ConfigTypes } from './config';
import { resolvers as LogResolvers, typeDefs as LogTypes } from './logging';
import { resolvers as UserUploadResolvers, typeDefs as UserUploadTypes } from './userUpload';
import { resolvers as TemplateResolvers, typeDefs as TemplateTypes } from './template';
import { IS_DEV } from '../constants';

const resolvers = {};
const directives = {};

const apolloServer = new ApolloServer({
  playground: IS_DEV,
  introspection: IS_DEV,
  typeDefs: [
    BaseType,
    AuthTypes,
    FileTypes,
    SpreadsheetTypes,
    FolderTypes,
    ConfigTypes,
    LogTypes,
    UserUploadTypes,
    TemplateTypes,
  ],
  resolvers: merge(
    resolvers,
    AuthResolvers,
    FileResolvers,
    FolderResolvers,
    ConfigResolvers,
    LogResolvers,
    UserUploadResolvers,
    SpreadsheetResolvers,
    TemplateResolvers,
  ),
  schemaDirectives: merge(directives, AuthDirectives, BaseDirectives),
  context: ({ req, ...a }) => {
    if (!req) {
      return { user: 'anon' };
    }
    return {
      user: req.user,
    };
  },
});

module.exports.apolloServer = apolloServer;

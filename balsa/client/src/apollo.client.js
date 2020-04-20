import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import DebounceLink from 'apollo-link-debounce';
import { createUploadLink } from 'apollo-upload-client';

import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
const DEFAULT_DEBOUNCE_TIMEOUT = 400;

const debounceLink = new DebounceLink(DEFAULT_DEBOUNCE_TIMEOUT);

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: localStorage.getItem('TOKEN') ? `Bearer ${localStorage.getItem('TOKEN')}` : null,
    },
  });
  return forward(operation);
});

const cache = new InMemoryCache();

const hostname = window.location.hostname;
const protocol = window.location.protocol;
const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
const serverUrl = `${protocol}//${hostname}`;
const wsUrl = `${wsProtocol}//${hostname}`;
const IS_DEV = process.env.VUE_APP_IS_DEV === 'true';

const httpLink = ApolloLink.from([
  authMiddleware,
  debounceLink,
  createUploadLink({
    uri: `${serverUrl}${IS_DEV ? ':3000' : ''}/graphql`,
  }),
]);

const wsLink = new WebSocketLink({
  uri: `${wsUrl}:3000'/graphql`,
  options: {
    reconnect: true,
  },
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const apolloClient = new ApolloClient({
  link,
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
});

export default apolloClient;

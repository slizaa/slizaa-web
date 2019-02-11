import { ApolloClient } from 'apollo-client';
import { ApolloProvider, ApolloConsumer } from 'react-apollo';

import { createHttpLink } from 'apollo-link-http';

import { InMemoryCache } from 'apollo-cache-inmemory';

import * as React from 'react';
import SlizaaTree from './slizaatree/SlizaaTree';

const httpLink = createHttpLink({
  uri: 'http://localhost:8085/graphql/'
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});

export const WrappedApp = () => (
  <ApolloProvider client={client}>

    <ApolloConsumer>
      { cl => <SlizaaTree client={cl} databaseId="test" hierarchicalGraphId="01" /> }
    </ApolloConsumer>

  </ApolloProvider>
);

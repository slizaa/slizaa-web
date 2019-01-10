import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import { createHttpLink } from 'apollo-link-http';

import { InMemoryCache } from 'apollo-cache-inmemory';

import { NodeIcon } from './NodeIcon';

import * as React from 'react';
import SlizaaTree from './slizaatree/SlizaaTree';

const httpLink = createHttpLink({
  uri: 'https://mpjk0plp9.lp.gql.zone/graphql',
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});

export const WrappedApp = () => (
  <ApolloProvider client={client}>

    <React.Fragment>


      <SlizaaTree />

      <NodeIcon
        centerImageSrc="http://localhost:8085/static/icons/class_obj.png"
        topLeftImageSrc="http://localhost:8085/static/icons/default_tsk.png"
        topRightImageSrc="http://localhost:8085/static/icons/default_tsk.png"
        bottomRightImageSrc="http://localhost:8085/static/icons/default_tsk.png" />

    </React.Fragment>
  </ApolloProvider>
);

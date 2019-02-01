import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import { createHttpLink } from 'apollo-link-http';

import { InMemoryCache } from 'apollo-cache-inmemory';

import * as React from 'react';
import SlizaaTree from './slizaatree/SlizaaTree';

const httpLink = createHttpLink({
  /* fetchOptions: {
    mode: 'no-cors',
  }, */
  uri: 'http://localhost:8085/graphql/'
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});

export const WrappedApp = () => (
  <ApolloProvider client={client}>

    <SlizaaTree client={client} databaseId="test" hierarchicalGraphId="01"/>

  </ApolloProvider>
);


{/* <React.Fragment>


      

<NodeIcon
  centerImageSrc="http://localhost:8085/static/icons/class_obj.png"
  topLeftImageSrc="http://localhost:8085/static/icons/default_tsk.png"
  topRightImageSrc="http://localhost:8085/static/icons/default_tsk.png"
  bottomRightImageSrc="http://localhost:8085/static/icons/default_tsk.png" />

</React.Fragment> */}
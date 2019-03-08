import './SlizaaApp.css';

import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import * as React from "react";
import { Component } from "react";
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { Action, createStore } from 'redux';
import { MainView } from './views/MainView';
import { ServerConfigValidator } from './views/serverconfig';

// TODO: origin url
const httpLink = createHttpLink({
  uri: 'http://localhost:8085/graphql/'
});

// create the apollo client instance
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});

const store = createStore(mainReducer, { counter: 0 });

class SlizaaApp extends Component {

  public render() {
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <ServerConfigValidator>
            <MainView />
          </ServerConfigValidator>  
        </Provider>
      </ApolloProvider>
    );
  }
}

function mainReducer(state: IApplicationState, action: Action) {
  return state;
}

export interface IApplicationState {
  counter: number;
};

export default SlizaaApp;

import gql from 'graphql-tag';

export const GQ_ALL_GRAPH_DATABASES = gql`
  query AllGraphDatabases {
    graphDatabases {
      identifier
      state
      availableActions
      port
      contentDefinition {
        type {
          identifier
          name
          description
        }
        definition
      }
      hierarchicalGraphs {
        identifier
      }
    }
  }
`;
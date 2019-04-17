import gql from 'graphql-tag';

export const GQ_ALL_GRAPH_DATABASES = gql`
  query AllGraphDatabases {
    graphDatabases {
      identifier
      state
      possibleActions
      port
      contentDefinition {
        contentDefinitionType {
          factoryId
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
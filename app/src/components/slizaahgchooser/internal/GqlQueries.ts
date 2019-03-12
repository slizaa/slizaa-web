import gql from 'graphql-tag'

export const GQ_GRAPHDATABASES_WITH_HIERARCHICAL_GRAPHS = gql`query GraphDatabasesWithHierarchicalGraphs {
    graphDatabases {
      identifier
      hierarchicalGraphs {
            identifier
      }
    }
  }`
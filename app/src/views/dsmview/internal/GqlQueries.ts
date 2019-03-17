import gql from 'graphql-tag'

export const GQ_DSM_FOR_NODE_CHILDREN = gql`query DsmForNodeChildren($databaseId: ID!, $hierarchicalGraphId: ID!, $nodeId: ID!)  {
    hierarchicalGraph(databaseIdentifier: $databaseId, hierarchicalGraphIdentifier: $hierarchicalGraphId) {
      node(id: $nodeId) {
        children {
          dependencyMatrix {
            orderedNodes {
              id
              text
            }
            cells {
              row
              column
              value
            }
            stronglyConnectedComponents {
              nodePositions
            }
          }
        }
      }
    }
  }`

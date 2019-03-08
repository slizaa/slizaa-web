import gql from 'graphql-tag';

export const NodeChildrenQuery = gql`
query NodeChildren($databaseId: ID!, $hierarchicalGraphId: ID!, $nodeId: ID!)  {
  hierarchicalGraph(databaseIdentifier: $databaseId, hierarchicalGraphIdentifier: $hierarchicalGraphId) {
    node(id: $nodeId) {
      id
      children {
        id
        text
        iconIdentifier
        hasChildren
      } 
    }
  }
}`
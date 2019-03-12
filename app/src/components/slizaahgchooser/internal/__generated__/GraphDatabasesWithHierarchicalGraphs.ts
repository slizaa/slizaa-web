/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GraphDatabasesWithHierarchicalGraphs
// ====================================================

export interface GraphDatabasesWithHierarchicalGraphs_graphDatabases_hierarchicalGraphs {
  __typename: "HierarchicalGraph";
  /**
   * Returns the identifier
   */
  identifier: string;
}

export interface GraphDatabasesWithHierarchicalGraphs_graphDatabases {
  __typename: "GraphDatabase";
  identifier: string;
  hierarchicalGraphs: GraphDatabasesWithHierarchicalGraphs_graphDatabases_hierarchicalGraphs[];
}

export interface GraphDatabasesWithHierarchicalGraphs {
  graphDatabases: GraphDatabasesWithHierarchicalGraphs_graphDatabases[];
}

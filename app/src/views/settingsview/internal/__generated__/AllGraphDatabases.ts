/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllGraphDatabases
// ====================================================

export interface AllGraphDatabases_graphDatabases_contentDefinition_type {
  __typename: "ContentDefinitionType";
  identifier: string;
  name: string;
  description: string | null;
}

export interface AllGraphDatabases_graphDatabases_contentDefinition {
  __typename: "ContentDefinition";
  type: AllGraphDatabases_graphDatabases_contentDefinition_type;
  definition: string;
}

export interface AllGraphDatabases_graphDatabases_hierarchicalGraphs {
  __typename: "HierarchicalGraph";
  /**
   * Returns the identifier
   */
  identifier: string;
}

export interface AllGraphDatabases_graphDatabases {
  __typename: "GraphDatabase";
  identifier: string;
  state: string;
  availableActions: string[];
  port: number;
  contentDefinition: AllGraphDatabases_graphDatabases_contentDefinition | null;
  hierarchicalGraphs: AllGraphDatabases_graphDatabases_hierarchicalGraphs[];
}

export interface AllGraphDatabases {
  graphDatabases: AllGraphDatabases_graphDatabases[];
}

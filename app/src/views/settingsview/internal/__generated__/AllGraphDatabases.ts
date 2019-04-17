/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllGraphDatabases
// ====================================================

export interface AllGraphDatabases_graphDatabases_contentDefinition_contentDefinitionType {
  __typename: "ContentDefinitionType";
  factoryId: string;
  name: string;
  description: string | null;
}

export interface AllGraphDatabases_graphDatabases_contentDefinition {
  __typename: "ContentDefinition";
  contentDefinitionType: AllGraphDatabases_graphDatabases_contentDefinition_contentDefinitionType;
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
  possibleActions: string[];
  port: number;
  contentDefinition: AllGraphDatabases_graphDatabases_contentDefinition | null;
  hierarchicalGraphs: AllGraphDatabases_graphDatabases_hierarchicalGraphs[];
}

export interface AllGraphDatabases {
  graphDatabases: AllGraphDatabases_graphDatabases[];
}

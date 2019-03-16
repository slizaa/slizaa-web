/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DsmForNodeChildren
// ====================================================

export interface DsmForNodeChildren_hierarchicalGraph_node_children_dependencyMatrix_orderedNodes {
  __typename: "Node";
  /**
   * The symbolicName for this node
   */
  id: string;
  /**
   * The text label
   */
  text: string;
}

export interface DsmForNodeChildren_hierarchicalGraph_node_children_dependencyMatrix_cells {
  __typename: "Cell";
  row: number;
  column: number;
  value: number;
}

export interface DsmForNodeChildren_hierarchicalGraph_node_children_dependencyMatrix {
  __typename: "DependencyMatrix";
  orderedNodes: DsmForNodeChildren_hierarchicalGraph_node_children_dependencyMatrix_orderedNodes[];
  cells: DsmForNodeChildren_hierarchicalGraph_node_children_dependencyMatrix_cells[];
}

export interface DsmForNodeChildren_hierarchicalGraph_node_children {
  __typename: "NodeSet";
  /**
   * the dependency matrix
   */
  dependencyMatrix: DsmForNodeChildren_hierarchicalGraph_node_children_dependencyMatrix;
}

export interface DsmForNodeChildren_hierarchicalGraph_node {
  __typename: "Node";
  /**
   * The children
   */
  children: DsmForNodeChildren_hierarchicalGraph_node_children;
}

export interface DsmForNodeChildren_hierarchicalGraph {
  __typename: "HierarchicalGraph";
  /**
   * Returns the node with the given id
   */
  node: DsmForNodeChildren_hierarchicalGraph_node | null;
}

export interface DsmForNodeChildren {
  hierarchicalGraph: DsmForNodeChildren_hierarchicalGraph | null;
}

export interface DsmForNodeChildrenVariables {
  databaseId: string;
  hierarchicalGraphId: string;
  nodeId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NodeChildren
// ====================================================

export interface NodeChildren_hierarchicalGraph_node_children {
  __typename: "Node";
  /**
   * The symbolicName for this node
   */
  id: string;
  /**
   * The text label
   */
  text: string;
  iconIdentifier: string;
  hasChildren: boolean;
}

export interface NodeChildren_hierarchicalGraph_node {
  __typename: "Node";
  /**
   * The symbolicName for this node
   */
  id: string;
  /**
   * The children
   */
  children: NodeChildren_hierarchicalGraph_node_children[];
}

export interface NodeChildren_hierarchicalGraph {
  __typename: "HierarchicalGraph";
  /**
   * Returns the node with the given id
   */
  node: NodeChildren_hierarchicalGraph_node | null;
}

export interface NodeChildren {
  hierarchicalGraph: NodeChildren_hierarchicalGraph | null;
}

export interface NodeChildrenVariables {
  databaseId: string;
  hierarchicalGraphId: string;
  nodeId: string;
}

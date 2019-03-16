import { Action } from 'redux';

export const ACTION_SELECT_DATABASE = 'ACTION_SELECT_DATABASE';
export const ACTION_SELECT_HIERARCHICAL_GRAPH = 'ACTION_SELECT_HIERARCHICAL_GRAPH';
export const ACTION_SELECT_NODE_SELECTION = 'ACTION_SELECT_NODE_SELECTION';

export interface IActionSelectDatabase extends Action {
  type: 'ACTION_SELECT_DATABASE';
  selectedDatabaseId: string;
}

export interface IActionSelectHierarchicalGraph extends Action {
  type: 'ACTION_SELECT_HIERARCHICAL_GRAPH';
  selectedHierarchicalGraphId: string;
}

export interface IActionSelectNodeSelection extends Action {
  type: 'ACTION_SELECT_NODE_SELECTION';
  selectedNodeIds: string[];
}

export type AppActions = IActionSelectDatabase | IActionSelectHierarchicalGraph | IActionSelectNodeSelection;

export function actionSelectDatabase(selectedDatabaseId: string): IActionSelectDatabase {
  return {
    selectedDatabaseId,
    type: ACTION_SELECT_DATABASE
  };
}

export function actionSelectHierarchicalGraph(selectedHierarchicalGraphId: string): IActionSelectHierarchicalGraph {
  return {
    selectedHierarchicalGraphId,
    type: ACTION_SELECT_HIERARCHICAL_GRAPH
  };
}

export function actionSelectNodeSelection(nodeIds: string[]): IActionSelectNodeSelection {
  return {
    selectedNodeIds: nodeIds,
    type: ACTION_SELECT_NODE_SELECTION
  };
}

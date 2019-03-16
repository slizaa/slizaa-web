export interface INodeSelection {
    nodeIds: string[];
}

export interface IAppState {
    currentDatabase?: string;
    currentHierarchicalGraph?: string;
    currentNodeSelection?: INodeSelection;
}

export function defaultState() : IAppState {
    return {};
  }
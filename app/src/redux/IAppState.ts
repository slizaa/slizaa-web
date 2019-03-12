export interface IAppState {
    currentDatabase?: string;
    currentHierarchicalGraph?: string;
}

export function defaultState() : IAppState {
    return {};
  }
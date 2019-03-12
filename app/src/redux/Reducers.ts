import { AppActions } from './Actions';
import { defaultState, IAppState } from './IAppState';

export function appReducer(state: IAppState = defaultState(), action: AppActions) : IAppState {
    
    //
    if (action.type === "ACTION_SELECT_DATABASE") {
        return {
            ...state,
            currentDatabase: action.selectedDatabaseId
        }
    }
    else if (action.type === "ACTION_SELECT_HIERARCHICAL_GRAPH") {
        return {
            ...state,
            currentHierarchicalGraph: action.selectedHierarchicalGraphId
        }
    }

    return state;
}
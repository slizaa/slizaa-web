import { ISlizaaTreeComponentNode } from './ISlizaaTreeComponentNode';

export interface ISlizaaTreeComponentModel {
    
    rootNodes: ISlizaaTreeComponentNode[];
    focusedNode?: ISlizaaTreeComponentNode;
}
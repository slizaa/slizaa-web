import { ISlizaaNode } from './ISlizaaNode';

export interface ISlizaaTreeComponentModel {
    rootNodes: ISlizaaNode[];
    focusedNode?: ISlizaaNode;
}
import { ISlizaaNode } from '../../../model/ISlizaaNode';

export interface ISlizaaTreeComponentModel {
    
    rootNodes: ISlizaaNode[];
    focusedNode?: ISlizaaNode;
}
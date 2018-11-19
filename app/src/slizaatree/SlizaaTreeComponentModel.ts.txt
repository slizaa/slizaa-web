import { SlizaaTreeComponentNode } from './SlizaaTreeComponentNode';

export class SlizaaTreeComponentModel {
    
    public rootNodes: SlizaaTreeComponentNode[];
    public focusedNode?: SlizaaTreeComponentNode;

    constructor() {
        this.rootNodes = [ new SlizaaTreeComponentNode("-1", "Root") ]; 
    }
}
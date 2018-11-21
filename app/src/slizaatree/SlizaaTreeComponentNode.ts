export class SlizaaTreeComponentNode {

    public key: string;
    public title: string;
    public expanded: boolean;
    public parent?: SlizaaTreeComponentNode;
    public children: SlizaaTreeComponentNode[];

    constructor(key: string, title: string, parent?: SlizaaTreeComponentNode) {
        this.key = key;
        this.title = title;
        this.parent = parent;
    }
}

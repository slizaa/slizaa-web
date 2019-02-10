
export interface ISlizaaTreeComponentNode {
    key: string;
    title: string;
    iconId: string;
    hasChildren: boolean;
    expanded?: boolean;
    parent?: ISlizaaTreeComponentNode;
    children?: ISlizaaTreeComponentNode[];
}

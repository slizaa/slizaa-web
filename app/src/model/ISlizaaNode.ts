
export interface ISlizaaNode {
    key: string;
    title: string;
    iconId: string;
    hasChildren: boolean;
    expanded?: boolean;
    parent?: ISlizaaNode;
    children?: ISlizaaNode[];
}

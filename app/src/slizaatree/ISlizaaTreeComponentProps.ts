import { AntTreeNodeSelectedEvent } from 'antd/lib/tree';

export interface ISlizaaTreeComponentProperties {
  databaseId: string;
  hierarchicalGraphId: string;
  onSelect:  (selectedKeys: string[], e: AntTreeNodeSelectedEvent) => void;
}

import { AntTreeNodeSelectedEvent } from 'antd/lib/tree';

export interface ISlizaaTreeProps {
  databaseId: string;
  hierarchicalGraphId: string;
  onSelect:  (selectedKeys: string[], e: AntTreeNodeSelectedEvent) => void;
}

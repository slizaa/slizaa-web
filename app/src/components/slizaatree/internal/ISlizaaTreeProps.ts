
export interface ISlizaaTreeProps {
  databaseId: string
  hierarchicalGraphId: string
  expandedKeys: string[]
  onSelect:  (selectedKeys: string[]) => void
  onExpand: (expandedKeys: string[]) => void
}

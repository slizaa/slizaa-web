import { Tree } from 'antd';
import { AntTreeNode, AntTreeNodeExpandedEvent, AntTreeNodeSelectedEvent } from "antd/lib/tree";
import { ApolloClient } from 'apollo-client';
import * as React from 'react';
import { WithApolloClient } from 'react-apollo';
import { ISlizaaNode } from 'src/components/slizaatree/internal/ISlizaaNode';
import { SlizaaIcon } from '../../slizaaicon';
import { NodeChildren, NodeChildrenVariables } from './__generated__/NodeChildren';
import { NodeChildrenQuery } from './GqlQueries';
import { ISlizaaTreeComponentModel } from './ISlizaaTreeComponentState';
import { ISlizaaTreeProps } from './ISlizaaTreeProps';
import './SlizaaTree.css';

export class SlizaaTree extends React.Component<WithApolloClient<ISlizaaTreeProps>, ISlizaaTreeComponentModel> {

  private slizaaTreeComponentModel: ISlizaaTreeComponentModel;

  private apolloClient: ApolloClient<any>;

  private databaseId: string;

  private hierarchicalGraphId: string;

  constructor(props: WithApolloClient<ISlizaaTreeProps>) {
    super(props);

    this.apolloClient = props.client;
    this.databaseId = props.databaseId;
    this.hierarchicalGraphId = props.hierarchicalGraphId;

    this.slizaaTreeComponentModel = {rootNodes: [{title: "root", key: "-1", hasChildren: true, iconId: "default"}]};
  }

  public onExpand = (expandedKeys: string[], info: AntTreeNodeExpandedEvent) => {
    this.props.onExpand(expandedKeys);
  }

  public onSelect = (selectedKeys: string[], info: AntTreeNodeSelectedEvent) => {
    this.props.onSelect(selectedKeys);
  }

  public onLoadData = (treeNode: AntTreeNode) => {

    return new Promise(async (resolve, reject) => {

      // return if children already have been resolved
      if (treeNode.props.dataRef.children) {
        resolve();
        return;
      }

      const key: string = treeNode.props.dataRef.key;

      this.apolloClient.query<NodeChildren, NodeChildrenVariables>({
        query: NodeChildrenQuery,
        variables: {
          databaseId: this.databaseId,
          hierarchicalGraphId: this.hierarchicalGraphId,
          nodeId: key
        }
      })
        .then(result => {

          // tslint:disable-next-line:no-console
          console.log(result);

          if (result.data.hierarchicalGraph && result.data.hierarchicalGraph.node) {
            const resultChildren = result.data.hierarchicalGraph.node.children.nodes
            treeNode.props.dataRef.children = new Array(resultChildren.length);
            
            for (let i = 0; i < resultChildren.length; i++) {
              treeNode.props.dataRef.children[i] = { title: resultChildren[i].text, key: resultChildren[i].id, parent: treeNode.props.dataRef, hasChildren: resultChildren[i].hasChildren, iconId: resultChildren[i].iconIdentifier };
            }
            
            this.setState({
              rootNodes: [...this.slizaaTreeComponentModel.rootNodes]
            });
          }
              
          resolve();
        })
        .catch(reason => {
          // tslint:disable-next-line:no-console
          console.error(reason);
          reject();
        });
    });
  }

  public renderTreeNodes = (treeNodes: ISlizaaNode[]) => {
    return treeNodes.map((item: ISlizaaNode) => {
      if (item.children) {
        return (
          <Tree.TreeNode
            icon={<SlizaaIcon iconId={item.iconId} />}
            title={this.trim(item.title)}
            key={item.key}
            dataRef={item}
            className={item === this.slizaaTreeComponentModel.focusedNode ? 'slizaa-tree slizaa-focus' : 'slizaa-tree'}
          >
            {this.renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      // tslint:disable-next-line:jsx-key
      return <Tree.TreeNode icon={<SlizaaIcon iconId={item.iconId} />} isLeaf={!item.hasChildren} title={this.trim(item.title)} key={item.key} dataRef={item} className={item === this.slizaaTreeComponentModel.focusedNode ? 'slizaa-focus' : ''} />;
    });
  }

  public render() {
    return (
        <Tree
          multiple={false}
          selectable={true}
          loadData={this.onLoadData}
          onSelect={this.onSelect}
          onExpand={this.onExpand}
          showIcon={true}
          showLine={false}
        >
          {this.renderTreeNodes(this.slizaaTreeComponentModel.rootNodes)}
        </Tree>
    );
  }

  private trim(value: string) : string {

    /*if (value.length > 25) {
      return value.substring(0, 23) + "...";
    }*/

    return value;
  }
}

export default SlizaaTree;
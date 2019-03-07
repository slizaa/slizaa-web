import { Tree } from 'antd';
import { AntTreeNode, AntTreeNodeExpandedEvent } from "antd/lib/tree";
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import * as React from 'react';
import { WithApolloClient } from 'react-apollo';
import { SlizaaIcon } from '../components/slizaaicon';
import { ISlizaaNode } from '../model/ISlizaaNode';
import { NodeChildren_hierarchicalGraph_node, NodeChildren_hierarchicalGraph_node_children } from './__generated__/NodeChildren';
import { ISlizaaTreeComponentProperties } from './ISlizaaTreeComponentProps';
import { ISlizaaTreeComponentModel } from './ISlizaaTreeComponentState';
import './SlizaaTree.css';

const nodeChildrenQuery = gql`
query NodeChildren($databaseId: ID!, $hierarchicalGraphId: ID!, $nodeId: ID!)  {
  hierarchicalGraph(databaseIdentifier: $databaseId, hierarchicalGraphIdentifier: $hierarchicalGraphId) {
    node(id: $nodeId) {
      id
      children {
        id
        text
        iconIdentifier
        hasChildren
      } 
    }
  }
}`

export class SlizaaTree extends React.Component<WithApolloClient<ISlizaaTreeComponentProperties>, ISlizaaTreeComponentModel> {

  private slizaaTreeComponentModel: ISlizaaTreeComponentModel;

  private apolloClient: ApolloClient<any>;

  private databaseId: string;

  private hierarchicalGraphId: string;

  constructor(props: WithApolloClient<ISlizaaTreeComponentProperties>) {
    super(props);

    this.apolloClient = props.client;
    this.databaseId = props.databaseId;
    this.hierarchicalGraphId = props.hierarchicalGraphId;

    this.slizaaTreeComponentModel = {rootNodes: [{title: "root", key: "-1", hasChildren: true, iconId: "default"}]};
  }

  public onExpand = (expandedKeys: string[], info: AntTreeNodeExpandedEvent) => {
    // empty block
  }

  public onClick = (e: React.MouseEvent<HTMLElement>, node: AntTreeNode) => {
    //  this.slizaaTreeComponentModel.focusedNode = node.props.dataRef;
    //  this.setState({
    //   focusedNode: this.slizaaTreeComponentModel.focusedNode
    // });
  }

  public onLoadData = (treeNode: AntTreeNode) => {

    return new Promise(async (resolve, reject) => {

      // return if children already have been resolved
      if (treeNode.props.dataRef.children) {
        resolve();
        return;
      }

      const key: string = treeNode.props.dataRef.key;

      this.apolloClient.query({
        query: nodeChildrenQuery,
        variables: {
          databaseId: this.databaseId,
          hierarchicalGraphId: this.hierarchicalGraphId,
          nodeId: key
        }
      })
        .then(result => {

          const resultChildren: NodeChildren_hierarchicalGraph_node_children[] = (result.data as NodeChildren_hierarchicalGraph_node).children;

          treeNode.props.dataRef.children = new Array(resultChildren.length);

          for (let i = 0; i < resultChildren.length; i++) {
            treeNode.props.dataRef.children[i] = { title: resultChildren[i].text, key: resultChildren[i].id, parent: treeNode.props.dataRef, hasChildren: resultChildren[i].hasChildren, iconId: resultChildren[i].iconIdentifier };
          }

          this.setState({
            rootNodes: [...this.slizaaTreeComponentModel.rootNodes]
          });

          resolve();
        })
        .catch(reason => {
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
        onClick={this.onClick}
        onSelect={this.props.onSelect}
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
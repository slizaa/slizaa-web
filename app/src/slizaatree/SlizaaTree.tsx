import { Tree } from 'antd';
import { SlizaaIcon } from '../slizaaicon/SlizaaIcon';
import { AntTreeNode, AntTreeNodeExpandedEvent, AntTreeNodeSelectedEvent } from "antd/lib/tree";
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import * as React from 'react';
import './SlizaaTree.css';
import { ISlizaaTreeComponentProperties } from './ISlizaaTreeComponentProperties';
import { WithApolloClient } from 'react-apollo';
import { ISlizaaTreeComponentNode } from './ISlizaaTreeComponentNode';
import { ISlizaaTreeComponentModel } from './ISlizaaTreeComponentModel';

const nodeChildrenQuery = gql`
query nodeChildren($databaseId: ID!, $hierarchicalGraphId: ID!, $nodeId: ID!)  {
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

interface IResultNode {
  id: string;
  text: string;
  iconIdentifier: string;
  hasChildren: boolean;
}

interface IResult {
  hierarchicalGraph: {
    node: {
      children: [IResultNode]
    }
  }
}

const TreeNode = Tree.TreeNode;

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

  public onSelect = (selectedKeys: string[], e: AntTreeNodeSelectedEvent): void => {
    // tslint:disable-next-line:no-console
    console.log(selectedKeys + " : " + e);
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

          const resultChildren: IResultNode[] = (result.data as IResult).hierarchicalGraph.node.children;

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
          // tslint:disable-next-line:no-console
          console.log(reason);
          reject();
        });
    });
  }

  public renderTreeNodes = (treeNodes: ISlizaaTreeComponentNode[]) => {
    return treeNodes.map((item: ISlizaaTreeComponentNode) => {
      if (item.children) {
        return (
          <TreeNode
            icon={<SlizaaIcon iconId={item.iconId} />}
            title={this.trim(item.title)}
            key={item.key}
            dataRef={item}
            className={item === this.slizaaTreeComponentModel.focusedNode ? 'slizaa-focus' : ''}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      // tslint:disable-next-line:jsx-key
      return <TreeNode icon={<SlizaaIcon iconId={item.iconId} />} isLeaf={!item.hasChildren} title={this.trim(item.title)} key={item.key} dataRef={item} className={item === this.slizaaTreeComponentModel.focusedNode ? 'slizaa-focus' : ''} />;
    });
  }

  public render() {
    return (
      <Tree
        multiple={false}
        selectable={true}
        loadData={this.onLoadData}
        onClick={this.onClick}
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
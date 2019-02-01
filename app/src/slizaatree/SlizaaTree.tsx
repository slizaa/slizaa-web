import { Tree } from 'antd';
import { Icon } from 'antd';
import { AntTreeNode, AntTreeNodeExpandedEvent, AntTreeNodeSelectedEvent } from "antd/lib/tree";
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import * as React from 'react';
import { withApollo } from "react-apollo";
// import {HotKeys} from 'react-hotkeys';
// import * as rm from 'typed-rest-client';
import './SlizaaTree.css';
import { SlizaaTreeComponentModel } from './SlizaaTreeComponentModel';
import { SlizaaTreeComponentNode } from './SlizaaTreeComponentNode';
export interface ISlizaaTreeComponentProperties {

  client: ApolloClient<any>;

  databaseId: string;

  hierarchicalGraphId: string;
}

const nodeChildrenQuery = gql`
query nodeChildren($databaseId: ID!, $hierarchicalGraphId: ID!, $nodeId: ID!)  {
  hierarchicalGraph(databaseIdentifier: $databaseId, hierarchicalGraphIdentifier: $hierarchicalGraphId) {
    node(id: $nodeId) {
      id
      children {
        id
        text
        hasChildren
      } 
    }
  }
}`

interface IResultNode {
  id: string;
  text: string;
  hasChildren:  boolean;
}

interface IResult {
  hierarchicalGraph: {
    node: {
      children: [IResultNode]
    }
  }
}

const TreeNode = Tree.TreeNode;

export class SlizaaTree extends React.Component<ISlizaaTreeComponentProperties, SlizaaTreeComponentModel> {

  private slizaaTreeComponentModel: SlizaaTreeComponentModel;

  private apolloClient: ApolloClient<any>;

  private databaseId: string;

  private hierarchicalGraphId: string;

  // private keyMap = {
  //   moveDown: 'down',
  //   moveUp: 'up'
  // }

  // private handlers = {
  //   'moveDown': (event : any) => {
  //     this.slizaaTreeComponentModel.focusedNode = this.slizaaTreeComponentModel.rootNodes[0];
  //     this.setState({
  //       focusedNode: this.slizaaTreeComponentModel.focusedNode
  //     });
  //   },
  //   'moveUp': (event : any) => console.log(event)
  // };

  constructor(props: ISlizaaTreeComponentProperties) {
    super(props);

    this.apolloClient = props.client;
    this.databaseId = props.databaseId;
    this.hierarchicalGraphId = props.hierarchicalGraphId;

    this.slizaaTreeComponentModel = new SlizaaTreeComponentModel();
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

  public onSelect =  (selectedKeys: string[], e: AntTreeNodeSelectedEvent) : void => {
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
            treeNode.props.dataRef.children[i] = { title: resultChildren[i].text, key: resultChildren[i].id, parent: treeNode.props.dataRef, hasChildren: resultChildren[i].hasChildren };
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




      // const queryString: string = (key === '-1') ? 'http://localhost:8080/rest/root' : 'http://localhost:8080/rest/node/' + key + '?resolveChildren=true';
      // const restRes: rm.IRestResponse<any> = await new rm.RestClient("hurz").get<any>(queryString);
      // if (restRes.statusCode === 200 && restRes.result.children) {



      // }
      // resolve();
    });
  }

  /**
   * 
   */
  public renderTreeNodes = (treeNodes: SlizaaTreeComponentNode[]) => {
    return treeNodes.map((item: SlizaaTreeComponentNode) => {
      if (item.children) {
        return (
          <TreeNode
            icon={<HeartIcon />}
            title={item.title}
            key={item.key}
            dataRef={item}
            className={item === this.slizaaTreeComponentModel.focusedNode ? 'slizaa-focus' : ''}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      // tslint:disable-next-line:jsx-key
      return <TreeNode icon={<PandaIcon />} isLeaf={!item.hasChildren} title={item.title} key={item.key} dataRef={item} className={item === this.slizaaTreeComponentModel.focusedNode ? 'slizaa-focus' : ''} />;
    });
  }

  /**
   * 
   */
  public render() {
    return (
      // <HotKeys keyMap={this.keyMap} handlers={this.handlers}>
      <Tree
        multiple={false}
        selectable={true}
        loadData={this.onLoadData}
        onClick={this.onClick}
        onSelect={this.onSelect}
        onExpand={this.onExpand}
        showIcon={true}
        showLine={true}
        className="hide-file-icon"
      >
        {this.renderTreeNodes(this.slizaaTreeComponentModel.rootNodes)}
      </Tree>
      // </HotKeys>
    );
  }
}

const PandaIcon = (props: any) => (
  <Icon component={PandaSvg} {...props} />
);

const HeartIcon = (props: any) => (
  <Icon component={HeartSvg} {...props} />
);

const PandaSvg = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path d="M99.096 315.634s-82.58-64.032-82.58-132.13c0-66.064 33.032-165.162 148.646-148.646 83.37 11.91 99.096 165.162 99.096 165.162l-165.162 115.614zM924.906 315.634s82.58-64.032 82.58-132.13c0-66.064-33.032-165.162-148.646-148.646-83.37 11.91-99.096 165.162-99.096 165.162l165.162 115.614z" fill="#6B676E" p-id="1143" />
    <path d="M1024 561.548c0 264.526-229.23 429.42-512.002 429.42S0 826.076 0 561.548 283.96 66.064 512.002 66.064 1024 297.022 1024 561.548z" fill="#FFEBD2" p-id="1144" />
    <path d="M330.324 842.126c0 82.096 81.34 148.646 181.678 148.646s181.678-66.55 181.678-148.646H330.324z" fill="#E9D7C3" p-id="1145" />
    <path d="M644.13 611.098C594.582 528.516 561.55 512 512.002 512c-49.548 0-82.58 16.516-132.13 99.096-42.488 70.814-78.73 211.264-49.548 247.742 66.064 82.58 165.162 33.032 181.678 33.032 16.516 0 115.614 49.548 181.678-33.032 29.18-36.476-7.064-176.93-49.55-247.74z" fill="#FFFFFF" p-id="1146" />
    <path d="M611.098 495.484c0-45.608 36.974-82.58 82.58-82.58 49.548 0 198.194 99.098 198.194 165.162s-79.934 144.904-148.646 99.096c-49.548-33.032-132.128-148.646-132.128-181.678zM412.904 495.484c0-45.608-36.974-82.58-82.58-82.58-49.548 0-198.194 99.098-198.194 165.162s79.934 144.904 148.646 99.096c49.548-33.032 132.128-148.646 132.128-181.678z" fill="#6B676E" p-id="1147" />
    <path d="M512.002 726.622c-30.06 0-115.614 5.668-115.614 33.032 0 49.638 105.484 85.24 115.614 82.58 10.128 2.66 115.614-32.944 115.614-82.58-0.002-27.366-85.556-33.032-115.614-33.032z" fill="#464655" p-id="1148" />
    <path d="M330.324 495.484m-33.032 0a33.032 33.032 0 1 0 66.064 0 33.032 33.032 0 1 0-66.064 0Z" fill="#464655" p-id="1149" />
    <path d="M693.678 495.484m-33.032 0a33.032 33.032 0 1 0 66.064 0 33.032 33.032 0 1 0-66.064 0Z" fill="#464655" p-id="1150" />
  </svg>
);

const HeartSvg = () => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
<path fill="#B85819" d="M511.777,0C229.473,0,0.603,228.883,0.603,511.188c0,282.339,228.871,511.212,511.175,511.212
	c282.332,0,511.199-228.873,511.199-511.212C1022.977,228.883,794.109,0,511.777,0z M567.533,728.251
	c45.053,0,95.021-9.802,124.421-21.568l22.539,116.595c-27.43,13.737-89.165,28.425-169.504,28.425
	c-228.296,0-345.886-142.074-345.886-330.206c0-225.366,160.702-350.784,360.574-350.784c77.418,0,136.188,15.683,162.643,29.397
	l-30.365,118.563c-30.375-12.742-72.512-24.499-125.421-24.499c-118.538,0-210.644,71.524-210.644,218.497
	C355.89,644.947,434.258,728.251,567.533,728.251z"/>
  </svg>
);


export default withApollo<ISlizaaTreeComponentProperties, {}>(SlizaaTree);
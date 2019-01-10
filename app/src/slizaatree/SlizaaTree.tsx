import { Tree } from 'antd';
import { AntTreeNode, AntTreeNodeExpandedEvent} from "antd/lib/tree";
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import * as React from 'react';
import { withApollo } from "react-apollo";
// import {HotKeys} from 'react-hotkeys';
// import * as rm from 'typed-rest-client';
import './SlizaaTree.css';
import { SlizaaTreeComponentModel } from './SlizaaTreeComponentModel';
import { SlizaaTreeComponentNode } from './SlizaaTreeComponentNode';
import { ISlizaaTreeComponentProperties } from './SlizaaTreeComponentProperties';


const TreeNode = Tree.TreeNode;

class SlizaaTree extends React.Component<ISlizaaTreeComponentProperties, SlizaaTreeComponentModel> {

  private slizaaTreeComponentModel : SlizaaTreeComponentModel;

  private apolloClient : ApolloClient<any>;

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

  constructor(props : ISlizaaTreeComponentProperties) {
    super(props);

    // tslint:disable-next-line:no-console
    console.log(props.client);

    this.slizaaTreeComponentModel = new SlizaaTreeComponentModel();
  }

  public onExpand =  (expandedKeys: string[], info: AntTreeNodeExpandedEvent)  => {
    // tslint:disable-next-line:no-console
    console.log(info.node.props.dataRef);
    return;
  }

  public onClick = (e: React.MouseEvent<HTMLElement>, node: AntTreeNode) => {

    //  this.slizaaTreeComponentModel.focusedNode = node.props.dataRef;
    //  this.setState({
    //   focusedNode: this.slizaaTreeComponentModel.focusedNode
    // });
  }

  /**
   * 
   */
  public onLoadData = (treeNode: AntTreeNode) => {
    
    return new Promise(async (resolve, reject) => {

      // return if children already have been resolved
      if (treeNode.props.children) {
        resolve();
        return;
      }

     
      this.apolloClient.query({
        query: gql`
          query {
            allTodos {
              id
              title
            }
          }
        `,
        variables: { breed: "bulldog" }
      })
       // tslint:disable-next-line:no-console
      .then(result => console.log(result));

      const key: string = treeNode.props.dataRef.key;
    // tslint:disable-next-line:no-console
    console.log(key);


      // const queryString: string = (key === '-1') ? 'http://localhost:8080/rest/root' : 'http://localhost:8080/rest/node/' + key + '?resolveChildren=true';
      // const restRes: rm.IRestResponse<any> = await new rm.RestClient("hurz").get<any>(queryString);
      // if (restRes.statusCode === 200 && restRes.result.children) {

      //   treeNode.props.dataRef.children = new Array(restRes.result.children.length);

      //   for (let i = 0; i < restRes.result.children.length; i++) {
      //     treeNode.props.dataRef.children[i] = { title: restRes.result.children[i].label, key: restRes.result.children[i].id, parent: treeNode.props.dataRef};
      //   }

      //   this.setState({
      //     rootNodes: [...this.slizaaTreeComponentModel.rootNodes]
      //   });

      // }
      resolve();
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
      return <TreeNode title={item.title} key={item.key} dataRef={item} className={item === this.slizaaTreeComponentModel.focusedNode ? 'slizaa-focus' : ''} />;
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
          selectable={false}
          loadData={this.onLoadData}
          onClick={this.onClick}
          onExpand={this.onExpand}
        >
          {this.renderTreeNodes( this.slizaaTreeComponentModel.rootNodes )}
        </Tree>
      // </HotKeys>
    );
  }
}

export default withApollo<{}, {}>(SlizaaTree);
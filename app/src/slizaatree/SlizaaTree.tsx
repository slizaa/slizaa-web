import { Tree } from 'antd';
import { AntTreeNode, /*, AntTreeNodeSelectedEvent */ 
AntTreeNodeExpandedEvent} from "antd/lib/tree";
import * as React from 'react';
// import {HotKeys} from 'react-hotkeys';
// import * as rm from 'typed-rest-client';
import {SlizaaService} from "../model/SlizaaService";
import './SlizaaTree.css';
import { SlizaaTreeComponentModel } from './SlizaaTreeComponentModel';
import { SlizaaTreeComponentNode } from './SlizaaTreeComponentNode';
import { SlizaaTreeComponentProperties } from './SlizaaTreeComponentProperties';


const TreeNode = Tree.TreeNode;

export class SlizaaTree extends React.Component<SlizaaTreeComponentProperties, SlizaaTreeComponentModel> {

  private slizaaTreeComponentModel : SlizaaTreeComponentModel;

  private slizaaService : SlizaaService;

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

  constructor(props : SlizaaTreeComponentProperties) {
    super(props);
    this.slizaaTreeComponentModel = new SlizaaTreeComponentModel();
    this.slizaaService = new SlizaaService();
  }

  public onExpand =  (expandedKeys: string[], info: AntTreeNodeExpandedEvent)  => {
    // tslint:disable-next-line:no-console
    console.log(info.node.props.dataRef);
    return;
  }

  public onClick = (e: React.MouseEvent<HTMLElement>, node: AntTreeNode) => {

      this.slizaaService.resolve(`{
        node(id: "` + 28 + `") {
          children {
            id
            text
          }
        }
      }`);


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

export default SlizaaTree;
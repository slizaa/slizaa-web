import { Button, Icon, Tabs } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import * as React from 'react';
import { Card } from '../../card';

export interface IGraphDbConfiguration {
    identifier: string
    state: string
    availableActions: string[]
    port: number
    hierarchicalGraphs: IHierarchicalGraph[]

}

export interface IHierarchicalGraph {
    identifier: string;
  }
  

export interface IGraphDbConfigurationEditorProps {
    graphdatabase: IGraphDbConfiguration
}

export class GraphDbConfigurationEditor extends React.Component<IGraphDbConfigurationEditorProps, {}> {

    public render() {

        // const menuItems = this.props.graphdatabase.availableActions.map(action => <Menu.Item key="action">{action}</Menu.Item>);
        // const menu = <Menu onClick={this.onClick}>
        //        {menuItems}
        //    </Menu>;

        const hierarchicalGraphs = this.props.graphdatabase.hierarchicalGraphs.map(hg => <Tabs.TabPane tab={hg.identifier} key={hg.identifier}>{hg.identifier}</Tabs.TabPane>);

        return (
            <Card title="Internal GraphDB" allowOverflow={false} >
                <div>
                    <div>{this.props.graphdatabase.identifier}</div>
                    <div>{this.props.graphdatabase.state}</div>
                    <div>{this.props.graphdatabase.port}</div>
                        <Button >
                            {this.props.graphdatabase.state} <Icon type="down" />
                        </Button>
                    
                    <Tabs defaultActiveKey="1" >
                        {hierarchicalGraphs}
                    </Tabs>
                </div>
            </Card>
        );
    }

    protected onClick = (clickParam: ClickParam) => {
        // tslint:disable-next-line:no-console
        console.log(clickParam.key);
    }
}
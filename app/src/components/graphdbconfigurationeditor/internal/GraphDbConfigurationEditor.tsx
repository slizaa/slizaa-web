import { Button, Dropdown, Icon, Menu, Tabs } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import * as React from 'react';
import { Card } from '../../card';

export interface IGraphDbConfiguration {
    identifier: string
    state: string
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

        const menu = (
            <Menu onClick={this.onClick}>
                <Menu.Item key="1">Start</Menu.Item>
                <Menu.Item key="2">Terminate</Menu.Item>
            </Menu>
        );

        const hierarchicalGraphs = this.props.graphdatabase.hierarchicalGraphs.map(hg => <Tabs.TabPane tab={hg.identifier} key={hg.identifier}>{hg.identifier}</Tabs.TabPane>);

        return (
            <Card title="Internal GraphDB" allowOverflow={false} >
                <div>
                    <div>{this.props.graphdatabase.identifier}</div>
                    <div>{this.props.graphdatabase.state}</div>
                    <div>{this.props.graphdatabase.port}</div>
                    <Dropdown overlay={menu} >
                        <Button >
                            {this.props.graphdatabase.state} <Icon type="down" />
                        </Button>
                    </Dropdown>
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
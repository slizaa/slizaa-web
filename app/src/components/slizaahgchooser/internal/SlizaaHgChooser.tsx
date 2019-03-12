import { Button, Dropdown, Menu } from 'antd';
import * as React from 'react';
import { Query } from 'react-apollo';
import { GraphDatabasesWithHierarchicalGraphs } from './__generated__/GraphDatabasesWithHierarchicalGraphs';
import { GQ_GRAPHDATABASES_WITH_HIERARCHICAL_GRAPHS } from './GqlQueries';

// tslint:disable-next-line:no-empty-interface
export interface ISlizaaHgChooserProps {
    currentDatabase: string | null;
    currentHierarchicalGraph: string | null;
}

// tslint:disable-next-line:no-empty-interface
export interface ISlizaaHgChooserState {
    //
}

export class SlizaaHgChooser extends React.Component<ISlizaaHgChooserProps, ISlizaaHgChooserState> {

    public render() {

        const menu = (
            <Menu>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3rd menu item</a>
                </Menu.Item>
            </Menu>
        );

        return <Query<GraphDatabasesWithHierarchicalGraphs, {}> query={GQ_GRAPHDATABASES_WITH_HIERARCHICAL_GRAPHS} >
            {({ loading, error, data }) => {

                const currentDatabaseLabel = (this.props.currentDatabase) ? this.props.currentDatabase : "-";
                const currentHierarchicalGraphLabel = (this.props.currentHierarchicalGraph) ? this.props.currentHierarchicalGraph : "-";

                return <div style={{ display: "inline-block" }}>
                    <Dropdown overlay={menu} placement="bottomLeft">
                        <Button>Database: {currentDatabaseLabel}</Button>
                    </Dropdown>
                    <Dropdown overlay={menu} placement="bottomCenter">
                        <Button>Hierarchical Graph: {currentHierarchicalGraphLabel}</Button>
                    </Dropdown>
                </div>
            }}
        </Query>
    }
}

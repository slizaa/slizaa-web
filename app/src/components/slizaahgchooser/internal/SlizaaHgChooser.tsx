import { Button, Dropdown, Menu } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import * as React from 'react';
import { Query } from 'react-apollo';
import { GraphDatabasesWithHierarchicalGraphs } from './__generated__/GraphDatabasesWithHierarchicalGraphs';
import { GQ_GRAPH_DATABASES_WITH_HIERARCHICAL_GRAPHS } from './GqlQueries';

import './SlizaaHgChooser.css';

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

    constructor(props: ISlizaaHgChooserProps) {
        super(props);

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    public render() {

        return <Query<GraphDatabasesWithHierarchicalGraphs, {}> query={GQ_GRAPH_DATABASES_WITH_HIERARCHICAL_GRAPHS} >
            {({ loading, error, data }) => {

                if (data && data.graphDatabases) {

                    const databasesMenuItems = data.graphDatabases.map(database => <Menu.Item key={database.identifier}>{database.identifier}</Menu.Item>);
                    const databasesMenu = <Menu onClick={this.handleOnClick}>
                        {databasesMenuItems}
                    </Menu>;

                    const hierarchicalGraphMenuItems = data.graphDatabases
                        .filter(database => this.props.currentDatabase && database.identifier === this.props.currentDatabase)
                        .map(database => database.hierarchicalGraphs.map(item => <Menu.Item key={item.identifier}>{item.identifier}</Menu.Item>));
                    const hierarchicalGraphsMenu = <Menu onClick={this.handleOnClick}>
                        {hierarchicalGraphMenuItems}
                    </Menu>;

                    const currentDatabaseLabel = (this.props.currentDatabase) ? this.props.currentDatabase : "-";
                    const currentHierarchicalGraphLabel = (this.props.currentHierarchicalGraph) ? this.props.currentHierarchicalGraph : "-";

                    return <div style={{ display: "inline-block" }}>
                        <Dropdown className="dropDownDatabases" overlay={databasesMenu} placement="bottomLeft">
                            <Button>Database: {currentDatabaseLabel}</Button>
                        </Dropdown>
                        <Dropdown className="dropDownHierarchicalGraphs" overlay={hierarchicalGraphsMenu} placement="bottomCenter">
                            <Button>Hierarchical Graph: {currentHierarchicalGraphLabel}</Button>
                        </Dropdown>
                    </div>
                } else {
                    // TODO
                    return <div>error</div>
                }
            }}
        </Query>
    }

    private handleOnClick(param: ClickParam) {
        // tslint:disable-next-line:no-console
        console.log(param.key);
    }
}

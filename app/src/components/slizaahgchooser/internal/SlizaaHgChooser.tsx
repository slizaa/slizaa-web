import { Button, Dropdown, Icon, Menu } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import * as React from 'react';
import { Query } from 'react-apollo';
import { GraphDatabasesWithHierarchicalGraphs } from './__generated__/GraphDatabasesWithHierarchicalGraphs';
import { GQ_GRAPH_DATABASES_WITH_HIERARCHICAL_GRAPHS } from './GqlQueries';

import './SlizaaHgChooser.css';

// tslint:disable-next-line:no-empty-interface
export interface ISlizaaHgChooserProps {
    currentDatabase: string | null
    currentHierarchicalGraph: string | null
    onDatabaseSelect: (selectedDatabaseId: string) => void
    onHierarchicalGraphSelect: (selectHierarchicalGraphId: string) => void
}

// tslint:disable-next-line:no-empty-interface
export interface ISlizaaHgChooserState {
    //
}

export class SlizaaHgChooser extends React.Component<ISlizaaHgChooserProps, ISlizaaHgChooserState> {

    constructor(props: ISlizaaHgChooserProps) {
        super(props);

        this.handleDatabaseSelection = this.handleDatabaseSelection.bind(this);
        this.handleHierarchicalGraphSelection = this.handleHierarchicalGraphSelection.bind(this);
    }

    public render() {

        return <Query<GraphDatabasesWithHierarchicalGraphs, {}> query={GQ_GRAPH_DATABASES_WITH_HIERARCHICAL_GRAPHS} >
            {({ loading, error, data }) => {

                if (data && data.graphDatabases) {

                    const databasesMenuItems = data.graphDatabases.map(database => <Menu.Item key={database.identifier}>{database.identifier}</Menu.Item>);
                    const databasesMenu = <Menu onClick={this.handleDatabaseSelection}>
                        {databasesMenuItems}
                    </Menu>;

                    const hierarchicalGraphMenuItems = data.graphDatabases
                        .filter(database => this.props.currentDatabase && database.identifier === this.props.currentDatabase)
                        .map(database => database.hierarchicalGraphs.map(item => <Menu.Item key={item.identifier}>{item.identifier}</Menu.Item>));
                    const hierarchicalGraphsMenu = <Menu onClick={this.handleHierarchicalGraphSelection}>
                        {hierarchicalGraphMenuItems}
                    </Menu>;

                    return <div className="slizaaHgChooser" style={{ display: "inline-block", float: "right" }}>
                        <Dropdown className="slizaaHgChooser-dropdown slizaaHgChooser-dropdown-database" overlay={databasesMenu} placement="bottomLeft">
                            <Button className="slizaaHgChooser-button slizaaHgChooser-button-database">
                                <div className="slizaaHgChooser-button-key" style={{display: "inline-block"}}>Database:</div>
                                <div className="slizaaHgChooser-button-value" style={{display: "inline-block"}}>
                                    {this.props.currentDatabase ? this.props.currentDatabase : <Icon type="disconnect" /> }
                                </div>
                            </Button>
                        </Dropdown>

                        <Dropdown className="slizaaHgChooser-dropdown slizaaHgChooser-dropdown-hierarchicalgraph" overlay={hierarchicalGraphsMenu} placement="bottomLeft">
                            <Button className="slizaaHgChooser-button slizaaHgChooser-button-hierarchicalgraph">
                                <div className="slizaaHgChooser-button-key" style={{display: "inline-block"}}>Hierarchical Graph:</div>
                                <div className="slizaaHgChooser-button-value" style={{display: "inline-block"}}>
                                    {this.props.currentHierarchicalGraph ? this.props.currentHierarchicalGraph : <Icon type="disconnect" /> }
                                </div>
                            </Button>
                        </Dropdown>
                    </div>
                } else {
                    // TODO
                    return <div>error</div>
                }
            }}
        </Query>
    }

    private handleDatabaseSelection(param: ClickParam) {
        this.props.onDatabaseSelect(param.key)
    }

    private handleHierarchicalGraphSelection(param: ClickParam) {
        this.props.onHierarchicalGraphSelect(param.key)
    }
}

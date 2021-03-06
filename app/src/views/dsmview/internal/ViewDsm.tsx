
import { Spin } from 'antd';
import * as React from 'react';
import { ApolloConsumer, Query } from 'react-apollo';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Card } from 'src/components/card';
import { DSM } from 'src/components/dsm';
import { HorizontalSplitLayout, ResizableBox } from 'src/components/layout';
import SlizaaTree from 'src/components/slizaatree/internal/SlizaaTree';
import { actionSelectNodeSelection } from 'src/redux/Actions';
import { IAppState, INodeSelection } from 'src/redux/IAppState';
import { DsmForNodeChildren, DsmForNodeChildrenVariables } from './__generated__/DsmForNodeChildren';
import { GQ_DSM_FOR_NODE_CHILDREN } from './GqlQueries';
import './ViewDsm.css';

interface IProps {
    databaseId: string
    hierarchicalGraphId: string
    nodeSelection?: INodeSelection
    dispatchSelectNodeSelection: (selectedNodeIds: string[]) => void
}

interface IState {
    treeWidth: number
    upperHeight: number
    lowerHeight: number
}

export class ViewDsm extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            lowerHeight: 371,
            treeWidth: 400,
            upperHeight: 600,
        }
    }

    public render() {

        if (!this.props.hierarchicalGraphId && !this.props.hierarchicalGraphId) {
            return null
        }

        const query = GQ_DSM_FOR_NODE_CHILDREN;
        const queryVariables = {
            databaseId: this.props.databaseId,
            hierarchicalGraphId: this.props.hierarchicalGraphId,
            nodeId: this.props.nodeSelection ? this.props.nodeSelection.nodeIds[0] : "-1"
        };

        // tslint:disable-next-line:no-console
        console.log(this.props.nodeSelection);
        const items = this.props.nodeSelection ? this.props.nodeSelection.nodeIds.map(id => <li key={id}>{id}</li>) : null;

        return (

            <div>
                <ResizableBox id="upperResizableBox" intitalHeight={this.state.upperHeight} onHeightChanged={this.onHeightChanged} >
                    <HorizontalSplitLayout id="upper" initialWidth={this.state.treeWidth} onWidthChanged={this.onWidthChanged}
                        left={
                            <Card title="Hierarchical Graph" >
                                <ApolloConsumer>
                                    {cl =>
                                        <SlizaaTree
                                            client={cl}
                                            databaseId={this.props.databaseId}
                                            hierarchicalGraphId={this.props.hierarchicalGraphId}
                                            onSelect={this.onSelect}
                                            onExpand={this.onExpand}
                                            expandedKeys={[]} />
                                    }
                                </ApolloConsumer>
                            </Card>
                        }
                        right={
                            <Card title="Dependencies Overview" >
                                <Query<DsmForNodeChildren, DsmForNodeChildrenVariables> query={query} variables={queryVariables} fetchPolicy="no-cache">
                                    {({ loading, data }) => {

                                        if (loading) {
                                            return <Spin size="large" />;
                                        }

                                        if (!data || !data.hierarchicalGraph || !data.hierarchicalGraph.node) {
                                            return <div>UNDEFINED - TODO</div>
                                        }

                                        // get  the data
                                        const { orderedNodes, cells, stronglyConnectedComponents } = data.hierarchicalGraph.node.children.dependencyMatrix

                                        return <DSM labels={orderedNodes}
                                                    cells={cells}
                                                    stronglyConnectedComponents={stronglyConnectedComponents}
                                                    horizontalBoxSize={35}
                                                    verticalBoxSize={35} />
                                    }}
                                </Query>
                            </Card>
                        }
                    />
                </ResizableBox>
                <ResizableBox id="lowerResizableBox" intitalHeight={this.state.lowerHeight} onHeightChanged={this.onHeightChanged}>
                    <Card title="Dependencies Details" >
                        <ul>
                            {items}
                        </ul>
                    </Card>
                </ResizableBox>
            </div>
        );
    }

    private onSelect = (selectedKeys: string[]): void => {
        // tslint:disable-next-line:no-console
        console.log("selectedKeys Keys: " + selectedKeys);
        this.props.dispatchSelectNodeSelection(selectedKeys);
    }

    private onExpand = (expandedKeys: string[]): void => {
        // tslint:disable-next-line:no-console
        console.log("expanded Keys: " + expandedKeys);
    }

    private onWidthChanged = (id: string, newWidth: number): void => {
        this.setState({ treeWidth: newWidth });
    }

    private onHeightChanged = (id: string, newHeight: number): void => {
        if (id === "upperResizableBox") {
            this.setState({ upperHeight: newHeight });
        }
        else if (id === "lowerResizableBox") {
            this.setState({ lowerHeight: newHeight });
        }
    }
}

const mapStateToProps = (state: IAppState) => {
    return {
        databaseId: state.currentDatabase,
        hierarchicalGraphId: state.currentHierarchicalGraph,
        nodeSelection: state.currentNodeSelection
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        dispatchSelectNodeSelection: (selectedNodeIds: string[]) => {
            dispatch(actionSelectNodeSelection(selectedNodeIds));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewDsm);
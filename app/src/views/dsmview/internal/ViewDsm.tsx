import { Card, Col, Row, } from 'antd';
import * as React from 'react';
import { ApolloConsumer, Query } from 'react-apollo';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { DSM } from 'src/components/dsm';
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

export class ViewDsm extends React.Component<IProps, any> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {

        if (!this.props.hierarchicalGraphId && !this.props.hierarchicalGraphId) {
            return <h1>NOT CONNECTED</h1>
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
                <Row gutter={16} type="flex" style={{ marginBottom: 16 }}>
                    <Col span={8} >
                        <Card title="Hierarchical Graph" bordered={false} style={{ overflow: 'auto', height: '100%' }}>
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
                    </Col>
                    <Col span={16} >
                        <Card title="Dependencies Overview" bordered={false} >
                            <Query<DsmForNodeChildren, DsmForNodeChildrenVariables> query={query} variables={queryVariables} fetchPolicy="no-cache">
                                {({ loading, data }) => {

                                    if (loading) {
                                        return null;
                                    }

                                    if (!data || !data.hierarchicalGraph || !data.hierarchicalGraph.node) {
                                        return <div>UNDEFINED - TODO</div>
                                    }

                                    // get  the data
                                    const {orderedNodes, cells, stronglyConnectedComponents } = data.hierarchicalGraph.node.children.dependencyMatrix
                                   
                                    return <DSM labels={orderedNodes}
                                                cells={cells}
                                                stronglyConnectedComponents={stronglyConnectedComponents} />
                                }}
                            </Query>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24} >
                        <Card title="Dependencies Details" bordered={false} style={{ overflow: 'auto' }}>
                            <ul>
                                {items}
                            </ul>
                        </Card>
                    </Col>
                </Row>
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
import { Card, Col, Row, } from 'antd';
import * as React from 'react';
import { ApolloConsumer, Query } from 'react-apollo';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import DSM from 'src/components/dsm';
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

        return (
            <ApolloConsumer>
                {cl =>
                    <div>
                        <Row gutter={16} type="flex" style={{ marginBottom: 16 }}>
                            <Col span={8} >
                                <Card title="Card title" bordered={false} style={{ overflow: 'auto', height: '100%' }}>
                                    <SlizaaTree
                                        client={cl}
                                        databaseId={this.props.databaseId}
                                        hierarchicalGraphId={this.props.hierarchicalGraphId}
                                        onSelect={this.onSelect}
                                        onExpand={this.onExpand}
                                        expandedKeys={[]} />
                                </Card>
                            </Col>
                            <Col span={16} >
                                <Card title="Card title" bordered={false} style={{ overflow: 'auto' }}>
                                    <Query<DsmForNodeChildren, DsmForNodeChildrenVariables> query={query} variables={queryVariables}>
                                        {({ data }) => {

                                            // tslint:disable-next-line:no-console
                                            console.log(queryVariables);

                                            if (!data || !data.hierarchicalGraph || !data.hierarchicalGraph.node) {
                                                return <div>UNDEFINED - TODO</div>
                                            }

                                            // get the ordered nodes
                                            const labels = data.hierarchicalGraph.node.children.dependencyMatrix.orderedNodes
                                            const dependencies = data.hierarchicalGraph.node.children.dependencyMatrix.cells;
                                            
                                            return <DSM labels={labels}
                                                cells={dependencies}
                                                height={500} width={500} />
                                        }}
                                    </Query>
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24} >
                                <Card title="Card title" bordered={false} style={{ overflow: 'auto' }}>
                                    HIER SIND DIE DEPENDENCIES
                                </Card>
                            </Col>
                        </Row>
                    </div>
                }
            </ApolloConsumer>
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
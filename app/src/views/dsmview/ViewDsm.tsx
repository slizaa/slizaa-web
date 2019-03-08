import { Card, Col, Row } from 'antd';
import { AntTreeNodeSelectedEvent } from 'antd/lib/tree';
import * as React from 'react';
import { ApolloConsumer } from 'react-apollo';
import DSM from 'src/components/dsm';
import SlizaaTree from 'src/components/slizaatree/internal/SlizaaTree';
import './ViewDsm.css';

export class ViewDsm extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    public render() {
        return (

            <ApolloConsumer>
                {cl =>
                    <div>
                        <Row>
                            <Col span={8} >
                                <Card>
                                    <SlizaaTree client={cl} databaseId="test" hierarchicalGraphId="01" onSelect={this.onSelect}/>
                                </Card>    
                            </Col>
                            <Col span={16} >
                                <Card>
                                    <DSM nodes={[{id:"1", text:"model"}, {id:"2", text:"tools"}, {id:"3", text:"lang"}, {id:"4", text:"ant"}]} 
                                         dependencies={[{source:1, target:3}, {source:2, target:3}]} 
                                        height={500} width={500} />
                                </Card>
                            </Col>
                        </Row>
                    </div>
                }
            </ApolloConsumer>
        );
    }

    private onSelect = (selectedKeys: string[], e: AntTreeNodeSelectedEvent): void => {
        // tslint:disable-next-line:no-console
        console.log(selectedKeys + " : " + e);
        //  this.slizaaTreeComponentModel.focusedNode = node.props.dataRef;
        //  this.setState({
        //   focusedNode: this.slizaaTreeComponentModel.focusedNode
        // });
      }
}
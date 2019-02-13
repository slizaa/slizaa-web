import * as React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { Row, Col } from 'antd';
import SlizaaTree from 'src/slizaatree/SlizaaTree';
import BarChart from 'src/d3ex/BarChart';
import { AntTreeNodeSelectedEvent } from 'antd/lib/tree';

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
                            <Col span={6} >
                                <SlizaaTree client={cl} databaseId="test" hierarchicalGraphId="01" onSelect={this.onSelect}/>
                            </Col>
                            <Col span={18} >
                                <BarChart data={[1, 2, 3]} height={500} width={500} />
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
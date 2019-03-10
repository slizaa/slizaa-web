import { Card, Col, Row, } from 'antd';
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
                        <Row gutter={16} type="flex" style={{  marginBottom: 16 }}>
                            <Col span={8} >
                                <Card title="Card title" bordered={false} style={{ overflow: 'auto', height: '100%' }}>
                                    <SlizaaTree client={cl} databaseId="test" hierarchicalGraphId="01" onSelect={this.onSelect} onExpand={this.onExpand} expandedKeys={[]} />
                                </Card>
                            </Col>
                            <Col span={16} >
                                <Card title="Card title" bordered={false} style={{ overflow: 'auto' }}>
                                    <DSM nodes={[{ id: "1", text: "model" }, { id: "2", text: "tools" }, { id: "3", text: "lang" }, { id: "4", text: "ant" }]}
                                        dependencies={[{ source: 1, target: 3 }, { source: 2, target: 3 }]}
                                        height={500} width={500} />
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
        console.log("Selected Keys: " + selectedKeys);
    }

    private onExpand = (expandedKeys: string[]): void => {
        // tslint:disable-next-line:no-console
        console.log("expanded Keys: " + expandedKeys);
    }
}
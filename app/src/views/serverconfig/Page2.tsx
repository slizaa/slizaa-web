import { Select, Spin } from 'antd';
import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';
import {AvailableServerExtensions} from './__generated__/AvailableServerExtensions';

const GQ_AVAILABLE_SERVER_EXTENSIONS = gql`
    query AvailableServerExtensions {
        availableServerExtensions {
            symbolicName
            version
        }
    }`;

export class Page2 extends React.Component<{}, { selectedItems: [] }> {

    constructor(props: {}) {
        super(props);

        this.state = {
            selectedItems: [],
        };
    }

    public render() {
        return <Query<AvailableServerExtensions, {}> query={GQ_AVAILABLE_SERVER_EXTENSIONS} >
            {
                ({ loading, error, data }) => {
                    if (loading) {
                        return <Spin size="large" />
                    }
                    // const filteredOptions = data.availableServerExtensions.filter((extension: any) => !selectedItems.includes( this.format(extension) ));
                    const children = data && data.availableServerExtensions.map((extension: any) => (
                        <Select.Option key={this.format(extension)}>{this.format(extension)}</Select.Option>
                    ))

                    return <div>{
                        <Select
                            mode="multiple"
                            className="serverExtensionsSelect"
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            onChange={this.handleChange}>
                            {children}
                        </Select>
                    }</div>
                }}
        </Query>
    }

    protected handleChange = (selectedItems: any) => {
        this.setState({ selectedItems });
    };

    private format(extension: any): string {
        return extension.symbolicName + " (" + extension.version + ")";
    }
}

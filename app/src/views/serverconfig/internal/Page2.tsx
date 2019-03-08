import { Select, Spin } from 'antd';
import * as React from 'react';
import { Query } from 'react-apollo';
import { AvailableServerExtensions } from './__generated__/AvailableServerExtensions';
import { GQ_AVAILABLE_SERVER_EXTENSIONS } from './GqlQueries';
import { IServerExtension } from './ServerConfigWizard';

interface IProps {
    selectedExtensions: IServerExtension[],
    onItemsSelected: (items: IServerExtension[]) => void
}


export class Page2 extends React.Component<IProps, {}> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return <Query<AvailableServerExtensions, {}> query={GQ_AVAILABLE_SERVER_EXTENSIONS} >
            {
                ({ loading, error, data }) => {
                    if (loading) {
                        return <Spin size="large" />
                    }
                    const children = data && data.availableServerExtensions.map((extension: any) => (
                        <Select.Option key={this.format(extension)}>{this.format(extension)}</Select.Option>
                    ))

                    return <div>{
                        <Select
                            mode="multiple"
                            className="serverExtensionsSelect"
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            onChange={this.handleChange}
                            defaultValue={this.props.selectedExtensions.map(item => item.symbolicName + "-" + item.version)}>
                            {children}
                        </Select>
                    }</div>
                }}
        </Query>
    }

    protected handleChange = (selectedItems: string[]) => {
        const serverExtensions = selectedItems.map(item => this.parse(item));
        this.props.onItemsSelected(serverExtensions);
    };

    private format(extension: IServerExtension): string {
        return extension.symbolicName + "-" + extension.version;
    }

    private parse(extensionAsString: string): IServerExtension {
        const parsed = extensionAsString.split("-");
        return {
            symbolicName: parsed[0],
            version: parsed[1]
        }
    }
}

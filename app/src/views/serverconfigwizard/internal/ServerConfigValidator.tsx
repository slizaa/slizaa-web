import { Spin } from 'antd';
import * as React from 'react';
import { Query } from 'react-apollo';
import { HasInstalledExtensions } from './__generated__/HasInstalledExtensions'
import { GQ_HAS_INSTALLED_EXTENSIONS } from './GqlQueries';
import { ServerConfigWizard } from './ServerConfigWizard';

export class ServerConfigValidator extends React.Component<{}, {}> {

    constructor(props: {}) {
        super(props)
    
        this.rerender = this.rerender.bind(this)
      }

    public rerender() {
        this.forceUpdate();
    }

    public render() {
        return <Query<HasInstalledExtensions, {}> query={GQ_HAS_INSTALLED_EXTENSIONS} >
        {({ loading, error, data }) => {
            if (loading) {  
                return <Spin size="large" /> 
            }
            if (data && data.hasInstalledExtensions) {
                return <div>{this.props.children}</div>
            } else {
                return <ServerConfigWizard rerender={this.rerender}/>
            }
        }}
    </Query>
    }
}
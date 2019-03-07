import { Spin } from 'antd';
import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';
import { HasInstalledExtensions } from './__generated__/HasInstalledExtensions'
import { ServerConfigWizard } from './ServerConfigWizard';

const GQ_HAS_INSTALLED_EXTENSIONS = gql`
  query HasInstalledExtensions {
    hasInstalledExtensions
  }
 `;

export class ServerConfigValidator extends React.Component<any, any> {

    constructor(props: any) {
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
                return <ServerConfigWizard rerender={this.rerender} />
            } else {
                return <ServerConfigWizard rerender={this.rerender}/>
            }
        }}
    </Query>
    }
}
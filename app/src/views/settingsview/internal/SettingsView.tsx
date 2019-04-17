import { Button, Icon, Spin } from 'antd';
import * as React from 'react';
import { Query } from 'react-apollo';
import { GraphDbConfigurationEditor } from 'src/components/graphdbconfigurationeditor';
import { AllGraphDatabases } from './__generated__/AllGraphDatabases';
import { GQ_ALL_GRAPH_DATABASES } from './GqlQueries';

export class SettingsView extends React.Component<{}, {}> {

  public render() {
    return <Query<AllGraphDatabases, {}> query={GQ_ALL_GRAPH_DATABASES} >
      {({ loading, error, data }) => {
        if (loading) {
          return <Spin size="large" />
        }
        if (data && data.graphDatabases) {

         const content = data.graphDatabases.map(db => <GraphDbConfigurationEditor key={db.identifier} graphdatabase={db} />);

          return <div>
            <Button type="dashed"><Icon type="plus" /> Add internal GraphDB</Button>
            <Button type="dashed"><Icon type="plus" />Add external GraphDB</Button>
            {content}
            </div>
        }
        return <h1>HAE?</h1>
      }}
    </Query>
  }
}
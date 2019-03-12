import { Icon, Layout, Menu } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import * as React from 'react';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import { SlizaaHgChooser } from 'src/components/slizaahgchooser';
import { ViewDsm } from 'src/views/dsmview/internal/ViewDsm';

interface IState {
  collapsed: boolean;
}

export class MainView extends React.Component<{}, IState> {

  constructor(props: {}) {
    super(props);

    this.state = {
      collapsed: true
    }

    this.onCollapse = this.onCollapse.bind(this);
  }

  public render() {
    return (
      <BrowserRouter>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            theme="dark"
            collapsible={true}
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
            trigger={null}
          >
            <div className="logo" />
            <Menu defaultSelectedKeys={['1']} mode="inline" theme="dark">
              <Menu.Item key="1">
                <Icon type="pie-chart" />
                <span>Deshboard</span>
                <Link to="/" />
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="setting" />
                <span>Meseros</span>
                <Link to="/meseros" />
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Layout.Header style={{ background: '#fff', padding: 0 }}>
              <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggleCollapsed}
              />
              <SlizaaHgChooser currentDatabase="test" currentHierarchicalGraph="01"/>
            </Layout.Header>
            <Layout.Content style={{ margin: 8, padding: 8, minHeight: 280 }}>
              <Route exact={true} path="/" component={ViewDsm} />
              <Route path="/meseros" component={ViewDsm} />
              <Route path="/spunkie" component={ViewDsm} />
              <Route path="/punkie" component={ViewDsm} />
            </Layout.Content>
          </Layout>
        </Layout>
      </BrowserRouter>

    )
  }

  protected onCollapse(isCollapsed: boolean) {
    this.setState({ ...this.state, collapsed: isCollapsed });
  }

  protected toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
}

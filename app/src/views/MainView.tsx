import { Icon, Layout, Menu } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import SubMenu from 'antd/lib/menu/SubMenu';
import * as React from 'react';
import { BrowserRouter, Link, Route } from 'react-router-dom';
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
              <SubMenu key="sub4" title={<span><Icon type="setting" /><span>DB 'Core'</span></span>}>
                <SubMenu key="subsub4" title={<span><Icon type="setting" /><span>H1</span></span>}>
                  <Menu.Item key="9">
                    <span>Spunkie</span>
                    <Link to="/spunkie" />
                  </Menu.Item>
                  <Menu.Item key="10">
                    <span>Punkie</span>
                    <Link to="/punkie" />
                  </Menu.Item>
                  <Menu.Item key="11">Option 11</Menu.Item>
                  <Menu.Item key="12">Option 12</Menu.Item>
                </SubMenu>
                <SubMenu key="subsub5" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
                  <Menu.Item key="11">Option 11</Menu.Item>
                  <Menu.Item key="12">Option 12</Menu.Item>
                </SubMenu>
              </SubMenu>
              <Menu.Item key="2">
                <Icon type="desktop" />
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

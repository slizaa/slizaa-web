import './App.css';

import { Icon, Layout, Menu } from 'antd';
import * as React from "react";
import { Component } from "react";
import { BrowserRouter, Link, Route, RouteComponentProps } from "react-router-dom";
import SlizaaTree from './slizaatree/SlizaaTree'

const { Header, Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class App extends Component {

  public state = {
    collapsed: true,
  };

  public render() {
    return (
      <BrowserRouter>
        <Layout style={{ minHeight: '100vh' }}>

          <Sider
            collapsible={true}
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1">
                <Icon type="pie-chart" />
                <span>Deshboard</span>
                <Link to="/" />
              </Menu.Item>
              <SubMenu key="sub4" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
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
              <Menu.Item key="2">
                <Icon type="desktop" />
                <span>Meseros</span>
                <Link to="/meseros" />
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0, paddingLeft: 16 }}>
              <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                style={{ cursor: 'pointer' }}
                onClick={this.toggle}
              />
            </Header>
            <Content style={{ margin: '8px', padding: 24, background: '#fff', minHeight: 280 }}>
              <Route exact={true} path="/" component={Dummy} />
              <Route path="/meseros" component={Dummy} />
              <Route path="/spunkie" component={Dummy} />
              <Route path="/punkie" component={Dummy} />
            </Content>
          </Layout>

        </Layout>
      </BrowserRouter>
    );
  }

  private onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed });
  }

  private toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
}

function Dummy( match : RouteComponentProps<any> ):any {
  return (
    <SlizaaTree />
  );
}

export default App;

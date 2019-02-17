import './App.css';

import { Icon, Layout, Menu } from 'antd';
import * as React from "react";
import { Component } from "react";
import { BrowserRouter, Link, Route, RouteComponentProps } from "react-router-dom";
import { createHttpLink } from 'apollo-link-http';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider} from 'react-apollo';
import BarChart from './d3ex/BarChart';
import { ViewDsm } from './view-dsm/ViewDsm';

const httpLink = createHttpLink({
  uri: 'http://localhost:8085/graphql/'
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});

const { Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class App extends Component {

  public state = {
    collapsed: true,
  };

  public render() {
    return (
      <ApolloProvider client={client}>

        <BrowserRouter>
          <Layout style={{ minHeight: '100vh' }}>
            <Sider
              theme="light"
              collapsible={true}
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}>
              <div className="logo" />
              <Menu defaultSelectedKeys={['1']} mode="inline">
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
              <Content style={{ margin: 8, padding: 8, background: '#fff', minHeight: 280 }}>
                <Route exact={true} path="/" component={ViewDsm} />
                <Route path="/meseros" component={Dummy} />
                <Route path="/spunkie" component={Dummy} />
                <Route path="/punkie" component={Dummy} />
              </Content>
            </Layout>
          </Layout>
        </BrowserRouter>
        
      </ApolloProvider>
    );
  }

  private onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed });
  }
}

function Dummy(match: RouteComponentProps<any>): any {
  return (
    <BarChart data={[1, 2, 3]} height={500} width={500} />
  );
}

export default App;

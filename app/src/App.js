import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import { Layout, Menu, Icon } from 'antd';

const { Header, Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup  = Menu.ItemGroup;

class App extends Component {

    state = {
        collapsed: false,
    };

    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {
        return (
            <BrowserRouter>
                <Layout style={{ minHeight: '100vh' }}>

                    <Sider
                        collapsible
                        collapsed={this.state.collapsed}
                        onCollapse={this.onCollapse}>
                        <div className="logo" />
                        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                            <Menu.Item key="1">
                                <Icon type="pie-chart" />
                                <span>Deshboard</span>
                                <Link exact={true} to="/" />
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
                            <Route exact path="/" render={(props) => <h1>ROOT</h1>} />
                            <Route path="/meseros" render={(props) => <h1>Meseros</h1>} />
                            <Route path="/spunkie" render={(props) => <h1>Spunkie</h1>} />
                            <Route path="/punkie" render={(props) => <h1>Punkie</h1>} />
                        </Content>
                    </Layout>

                </Layout>
            </BrowserRouter>
        );
    }
}

export default App;
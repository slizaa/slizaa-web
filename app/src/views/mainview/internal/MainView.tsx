import { Icon, Layout, Menu } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import * as React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import { Dispatch } from 'redux';
import { SlizaaHgChooser } from 'src/components/slizaahgchooser';
import { actionSelectDatabase, actionSelectHierarchicalGraph } from 'src/redux/Actions';
import { IAppState } from 'src/redux/IAppState';
import ViewDsm from 'src/views/dsmview/internal/ViewDsm';

import './MainView.css';
import { DependencyVisualisation } from './SlizaaIcons';

interface IProps {
  currentDatabase: string
  currentHierarchicalGraph: string
  dispatchSelectDatabase: (selectedDatabaseId: string) => void
  dispatchSelectHierarchicalGraph: (selectHierarchicalGraphId: string) => void
}
interface IState {
  collapsed: boolean
}
export class MainView extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {
      collapsed: true
    }

    this.onCollapse = this.onCollapse.bind(this);
  }

  public render() {

    // TODO
    const imageSource = "logo.svg";

    return (
      <BrowserRouter>
        <Layout
          style={{ minHeight: '100vh' }}>
          <Layout.Header style={{ padding: 0 }}>
              <Link to="/">
                <img className="slizaa-logo" src={imageSource} alt="logo" />
              </Link>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggleCollapsed}
            />
            <SlizaaHgChooser
              currentDatabase={this.props.currentDatabase}
              currentHierarchicalGraph={this.props.currentHierarchicalGraph}
              onDatabaseSelect={this.props.dispatchSelectDatabase}
              onHierarchicalGraphSelect={this.props.dispatchSelectHierarchicalGraph}
            />
          </Layout.Header>
          <Layout>
            <Sider
              theme="dark"
              collapsible={true}
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
              trigger={null}
              collapsedWidth={0}
              width={170}
            >
              <Menu defaultSelectedKeys={['1']}
                theme="dark"
                mode="inline" >
                <Menu.Item key="1">
                  <Icon component={DependencyVisualisation} />
                  <span>Dependencies</span>
                  <Link to="/" />
                </Menu.Item>
                <Menu.Item key="2">
                  <Icon type="setting" />
                  <span>Settings</span>
                  <Link to="/settings" />
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout.Content style={{ padding: 8, minHeight: 280 }}>
              <Route exact={true} path="/" component={ViewDsm} />
              <Route path="/settings" component={ViewDsm} />
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

const mapStateToProps = (state: IAppState) => {
  return {
    currentDatabase: state.currentDatabase,
    currentHierarchicalGraph: state.currentHierarchicalGraph,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => { // tslint:disable-line
  return {
    dispatchSelectDatabase: (selectedDatabaseId: string) => {
      dispatch(actionSelectDatabase(selectedDatabaseId));
    },
    dispatchSelectHierarchicalGraph: (selectedDatabaseId: string) => {
      dispatch(actionSelectHierarchicalGraph(selectedDatabaseId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
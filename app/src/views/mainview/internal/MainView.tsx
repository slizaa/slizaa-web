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
    const imageSource = this.state.collapsed ? "favicon.ico" : "favicon.ico";
  
    return (
      <BrowserRouter>
        <Layout 
            style={{ minHeight: '100vh' }}>
          <Sider
            theme="light"            
            collapsible={true}
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
            trigger={null}
          >
            <div className="main-view-sider-logo" >
              <Link to="/">
                <img src={imageSource} alt="logo" />
              </Link>
            </div>
            <Menu defaultSelectedKeys={['1']} 
                  theme="light"
                  mode="inline" >
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
            <Layout.Header style={{ padding: 0 }}>
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
            <Layout.Content style={{ padding: 8, minHeight: 280 }}>
              <Route exact={true} path="/" component={ViewDsm} />
              <Route path="/meseros" component={ViewDsm} />
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
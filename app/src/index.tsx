import "antd/dist/antd.css";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { WrappedApp } from './SlizaaApp';

import './index.css';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <WrappedApp />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

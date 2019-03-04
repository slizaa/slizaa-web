import "antd/dist/antd.css";
import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import SlizaaApp from './SlizaaApp';

ReactDOM.render(
  <SlizaaApp />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

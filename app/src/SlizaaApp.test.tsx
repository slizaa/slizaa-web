import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SlizaaApp from './SlizaaApp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SlizaaApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});

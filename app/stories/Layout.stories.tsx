import '../src/SlizaaApp.css'

import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Card } from '../src/components/card';
import { HorizontalSplitLayout, ResizableBox } from '../src/components/layout';

storiesOf('Layout', module)
  .add('Resizable box (100px)', () => (
    <ResizableBox id="lowerResizableBox" intitalHeight={100} >
      <div style={{ backgroundColor: 'coral', width: "100%", height: "1000px" }}>Hello!</div>
    </ResizableBox>
  ))
  .add('Resizable box (350px)', () => (
    <ResizableBox id="lowerResizableBox" intitalHeight={350} >
      <div style={{ backgroundColor: 'coral', width: "100%", height: "1000px" }}>Hello!</div>
    </ResizableBox>
  ))
  .add('HorizontalSplitLayout', () => (
    <ResizableBox id="lowerResizableBox" intitalHeight={100} >
      <HorizontalSplitLayout
        id="upper"
        initialWidth={450}
        left={
          <Card title="Left">
            <div style={{ backgroundColor: 'coral', width: "100%", height: "1000px" }}>Left</div>
          </Card>
        }
        right={
          <Card title="Right">
            <div style={{ backgroundColor: 'red', width: "750px", height: "1000px" }}>Right</div>
          </Card>} />
    </ResizableBox>
  ));
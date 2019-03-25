import { storiesOf } from '@storybook/react';
import * as React from 'react';
import ResizableBox from '../src/components/layout/ResizableBox';

let height = 100

function onHeightChanged(id: string, newHeight: number): void {
  height = newHeight;
}

storiesOf('ResizableBox', module)
  .add('4x4 with cycle', () => (
    <ResizableBox id="lowerResizableBox" height={height} onHeightChanged={onHeightChanged}
    component={
        <div style={{backgroundColor: 'coral', width: "100%", height: "150px"}}>Hello!</div>
    }
/>
  )); 
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { DSM } from '../src/components/dsm';

function createCells(count: number): Array<{ row: number, column: number, value: number }> {
  const result: Array<{ row: number, column: number, value: number }> = [];
  for (let i = 0; i < count; i++) {
    for (let j = 0; j < count; j++) {
      result.push({row: i, column: j, value: 1});      
    }
  }
  return result;
}

function createLabels(count: number): Array<{ id: string, text: string }> {
  const result: Array<{ id: string, text: string }> = [];
  for (let index = 0; index < count; index++) {
    result.push({id: "Module " + index, text: "Module " + index});
  }
  return result;
}

storiesOf('DSM', module)
  .add('4x4 with cycle', () => (
    <DSM labels={createLabels(4)}
      cells={createCells(4)}
      stronglyConnectedComponents={[{ nodePositions: [1, 2] }]} />
  ))
  .add('4x4 without cycle', () => (
    <DSM labels={createLabels(4)}
      cells={createCells(4)}
      stronglyConnectedComponents={[]} />
  ))
  .add('20x20 with custom box size', () => (
    <DSM labels={createLabels(20)}
      cells={createCells(20)}
      stronglyConnectedComponents={[]} 
      horizontalBoxSize={50}
      verticalBoxSize={30}/>
  ))
  .add('40x40 without cycle', () => (
    <DSM labels={createLabels(40)}
      cells={createCells(40)}
      stronglyConnectedComponents={[]} />
  ))
  .add('10x10 with cycles', () => (
    <DSM labels={createLabels(10)}
      cells={createCells(10)}
      stronglyConnectedComponents={ [{ nodePositions: [1, 2] }, { nodePositions: [7, 8, 9] } ]} />
  )); 
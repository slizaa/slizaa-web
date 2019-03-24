import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { DSM } from '../src/components/dsm';

const labels = [{ id: "1", text: "module 1" }, { id: "2", text: "module 2" }, { id: "3", text: "module 3" }, { id: "4", text: "module 4" }]

const cells = [
  { row: 0, column: 0, value: 1 }, { row: 0, column: 1, value: 1 }, { row: 0, column: 2, value: 1 }, { row: 0, column: 3, value: 1 },
  { row: 1, column: 0, value: 1 }, { row: 1, column: 1, value: 1 }, { row: 1, column: 2, value: 1 }, { row: 1, column: 3, value: 1 },
  { row: 2, column: 0, value: 1 }, { row: 2, column: 1, value: 1 }, { row: 2, column: 2, value: 1 }, { row: 2, column: 3, value: 1 },
  { row: 3, column: 0, value: 1 }, { row: 3, column: 1, value: 1 }, { row: 3, column: 2, value: 1 }, { row: 3, column: 3, value: 1 },
]

const stronglyConnectedComponents = [{ nodePositions: [1, 2] }]

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
    <DSM labels={labels}
      cells={cells}
      stronglyConnectedComponents={stronglyConnectedComponents} />
  ))
  .add('4x4 without cycle', () => (
    <DSM labels={labels}
      cells={cells}
      stronglyConnectedComponents={[]} />
  ))
  .add('20x20 without cycle', () => (
    <DSM labels={createLabels(20)}
      cells={createCells(20)}
      stronglyConnectedComponents={[]} />
  ))
  .add('40x40 without cycle', () => (
    <DSM labels={createLabels(40)}
      cells={createCells(40)}
      stronglyConnectedComponents={[]} />
  )); 
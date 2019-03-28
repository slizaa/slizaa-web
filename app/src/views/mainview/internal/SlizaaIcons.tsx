import { Icon } from 'antd';
import * as React from 'react';

export const DependencyVisualisation = () => (
  <svg x="0px" y="0px" width="16.422px" height="16.297px" viewBox="0 0 16.422 16.297" enable-background="new 0 0 16.422 16.297">
    <rect x="0.5" y="0.5" fill="none" stroke="#FFFFFF" stroke-miterlimit="10" width="5.328" height="5.328" />
    <rect x="10.594" y="3.823" fill="none" stroke="#FFFFFF" stroke-miterlimit="10" width="5.328" height="5.328" />
    <rect x="3.865" y="10.469" fill="none" stroke="#FFFFFF" stroke-miterlimit="10" width="5.328" height="5.328" />
    <line fill="none" stroke="#FFFFFF" stroke-miterlimit="10" x1="5.828" y1="3.969" x2="10.672" y2="5.578" />
    <line fill="none" stroke="#FFFFFF" stroke-miterlimit="10" x1="3.938" y1="5.703" x2="5.813" y2="10.563" />
    <line fill="none" stroke="#FFFFFF" stroke-miterlimit="10" x1="8.953" y1="10.781" x2="10.797" y2="8.891" />
  </svg>
);

export const DependencyVisualisationIcon = (props: any) => (
  <Icon component={DependencyVisualisation} {...props} />
);
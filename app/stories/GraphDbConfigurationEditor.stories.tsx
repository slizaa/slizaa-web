import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { GraphDbConfigurationEditor } from '../src/components/graphdbconfigurationeditor';

const database = JSON.parse('{  "identifier": "test",  "state": "NOT_RUNNING",  "port": 12806,  "contentDefinition": {    "contentDefinitionType": {      "factoryId": "org.slizaa.scanner.contentdefinition.MvnBasedContentDefinitionProviderFactory",      "name": "Maven Based",      "description": ""    },    "definition": "io.vavr:vavr:jar:0.10.0"  },  "hierarchicalGraphs": [ {"identifier": "01"} ]}')

storiesOf('GraphDbConfigurationEditor', module)
  .add('GraphDbConfigurationEditor', () => (
      <GraphDbConfigurationEditor graphdatabase={database}/>
  )
);
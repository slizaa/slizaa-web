import * as React from 'react';
import { ITestProps } from './ITestProps';
import { WithApolloClient } from 'react-apollo';

export class Test extends React.Component<WithApolloClient<ITestProps>, any> {

    constructor(props: WithApolloClient<ITestProps>) {
        super(props);

        // tslint:disable-next-line:no-console
        console.log(props.client);

    }

    public render() {
        return (
            <h1>bumm</h1>
        );
    }
}


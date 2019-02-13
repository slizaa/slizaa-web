import * as React from 'react';
import './SlizaaIcon.css';
import { WithApolloClient, Query } from 'react-apollo';
import { Icon } from 'antd';
import { ISlizaaIconProperties } from './ISlizaaIconProperties';
import gql from 'graphql-tag';

const GET_SVG = gql`
  query Svg($identifier: ID!) {
    svg(identifier: $identifier) 
  }
`;

const svgCache = new Map();

export class SlizaaIcon extends React.Component<ISlizaaIconProperties, any> {

    constructor(props: WithApolloClient<ISlizaaIconProperties>) {
        super(props);
    }

    public render() {

        // return the cached instance if exist
        if (svgCache.has(this.props.iconId)) {
            // tslint:disable-next-line:jsx-no-lambda
            return <Icon component={() => <div dangerouslySetInnerHTML={createMarkup(svgCache.get(this.props.iconId))} />} />
        }

        return (
            <Query query={GET_SVG} variables={{ identifier: this.props.iconId }}>
                {({ loading, error, data }) => {
                    if (loading) { return <Icon component={PandaSvg} />; }
                    if (error) { return <Icon component={PandaSvg} /> }
                    if (data.svg) {
                        svgCache.set(this.props.iconId, data.svg);
                        // tslint:disable-next-line:jsx-no-lambda
                        return <Icon component={() => <div dangerouslySetInnerHTML={createMarkup(data.svg)} />} />
                    } else {
                        return <Icon component={PandaSvg} />
                    }

                }}
            </Query>
        );
    }
}

function createMarkup(svg: string) {
    return { __html: svg };
}

const PandaSvg = () => (
    <svg viewBox="0 0 1000 1000" width="18px" height="18px" fill="currentColor">
        <path fill="#5B86C0" stroke="#000000" stroke-width="30" strokeMiterlimit="10" d="M250.5,188.833V821.5h0.022
	c0.963,51.238,112.728,92.666,250.478,92.666c137.752,0,249.516-41.428,250.479-92.666h0.021V188.833H250.5z"/>
<ellipse fill="#7A9FCF" stroke="#000000" stroke-width="30" stroke-miterlimit="10" cx="501" cy="180.5" rx="250.5" ry="93.333"/>
    </svg>
);

export default SlizaaIcon;
import * as React from 'react';
import './Card.css';

export interface IProps {
    title: string
}

export class Card extends React.Component<IProps> {

    private readonly cardStyle = {
        alignItems: 'stretch',
        display: 'flex',
        flexFlow: 'column',
        height: '100%',
        width: '100%',
    };

    public render() {
        return (
            <div className="slizaa-card" style={this.cardStyle}>
                <div>{this.props.title}</div>
                <div style={{ width: '100%', height: '100%', overflow: 'auto' }} >{this.props.children}</div>
            </div>
        );
    }

}
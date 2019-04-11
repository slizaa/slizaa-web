import * as React from 'react';
import './Card.css';

export interface IProps {
    title: string
    allowOverflow?: boolean
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

        const body = this.props.allowOverflow !== undefined && !this.props.allowOverflow ?
            <div className="slizaa-card-body" style={{ flex: "0 0 0px"}} >{this.props.children}</div> :
            <div className="slizaa-card-body" style={{ flex: "1 0 0px", overflow: 'auto' }} >{this.props.children}</div>;

        return (
            <div className="slizaa-card" style={this.cardStyle}>
                <div className="slizaa-card-title" style={{ flex: "0 0 0px" }}>{this.props.title}</div>
                {body}
            </div>
        );
    }

}
import * as React from 'react';
import { DraggableCore, DraggableData, DraggableEvent, DraggableEventHandler } from 'react-draggable';

import './CommonLayout.css';

export interface IProps {
    width: number
    left: JSX.Element
    right: JSX.Element
}

export interface IState {
    resizing: boolean
    currentWidth: number
}

export default class HorizontalSplitLayout extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        // Don't call this.setState() here!
        this.state = {
            currentWidth: props.width,
            resizing: false
        };
    }

    public render() {
        return (
            <div className="contentFlexContainer" style={{ flexFlow: "row", height: "100%" }}>
                <div className="item item1" style={{ flex: "0 0 " + this.state.currentWidth + "px" }}>
                    {this.props.left}
                </div>
                <DraggableCore
                    onStop={this.dragHandler('onResizeStop')}
                    onStart={this.dragHandler('onResizeStart')}
                    onDrag={this.dragHandler('onResize')} >
                    <div className="verticalDivider" style={{ width: "10px" }} />
                </DraggableCore>
                <div className="item item2" style={{ flex: "1 0 0px" }}>
                    {this.props.right}
                </div>
            </div>
        );
    }

    private dragHandler = (handlerName: string): DraggableEventHandler => {
        return (e: DraggableEvent, data: DraggableData): void | false => {

            const newState: IState = {
                currentWidth: this.state.currentWidth,
                resizing: this.state.resizing,
            };

            if (handlerName === 'onResizeStart') {
                newState.resizing = true;
            } else if (handlerName === 'onResizeStop') {
                newState.resizing = false;
            } else {
                const newWidth = this.state.currentWidth + data.deltaX;
                // Early return if no change after constraints
                if (newWidth === this.state.currentWidth) { return };
                newState.currentWidth = newWidth;
            }

            this.setState(newState);
        }
    }
}
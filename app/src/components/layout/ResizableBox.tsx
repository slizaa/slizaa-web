import * as React from 'react';
import { DraggableCore, DraggableData, DraggableEvent, DraggableEventHandler } from 'react-draggable';

import './CommonLayout.css';

export interface IProps {
    height: number
    gutter?: number
    component: JSX.Element
}

export interface IState {
    resizing: boolean
    currentHeight: number
}

export default class ResizableBox extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        // Don't call this.setState() here!
        this.state = { resizing: false, currentHeight: props.height };
    }

    public componentWillReceiveProps(nextProps: IProps) {

        // If parent changes height, set that in our state.
        if (!this.state.resizing && nextProps.height !== this.props.height) {
            this.setState({
                currentHeight: nextProps.height
            });
        }
    }

    public render() {
        return (
            <div style={{ overflow: "hidden", backgroundColor: "transparent"}}>
                <div style={{ height: this.state.currentHeight + "px", overflow: "hidden", backgroundColor: "transparent" }}>
                    {React.cloneElement(this.props.component, { style: { height: this.state.currentHeight } })}
                </div>
                <DraggableCore
                    onStop={this.dragHandler('onResizeStop')}
                    onStart={this.dragHandler('onResizeStart')}
                    onDrag={this.dragHandler('onResize')}>
                    <div className="horizontalDivider" style={{ height: this.props.gutter ? this.props.gutter : 8 + "px" }} />
                </DraggableCore>
            </div>
        );
    }

    private dragHandler = (handlerName: string): DraggableEventHandler => {
        return (e: DraggableEvent, data: DraggableData): void | false => {

            const newState: IState = {
                currentHeight: this.state.currentHeight,
                resizing: this.state.resizing,
            };

            if (handlerName === 'onResizeStart') {
                newState.resizing = true;
            } else if (handlerName === 'onResizeStop') {
                newState.resizing = false;
            } else {
                const newHeight = this.state.currentHeight + data.deltaY;
                // Early return if no change after constraints
                if (newHeight === this.state.currentHeight) { return };
                newState.currentHeight = newHeight;
            }

            this.setState(newState);
        }
    }
}
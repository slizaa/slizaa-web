import * as React from 'react';
import { DraggableCore, DraggableData, DraggableEvent, DraggableEventHandler } from 'react-draggable';

import './Layout.css';

export interface IProps {
    id: string
    left: JSX.Element
    right: JSX.Element
    initialWidth?: number
    gutter?: number
    onWidthChanged?: (id: string, newWidth: number) => void;
}

export interface IState {
    width: number
}

export class HorizontalSplitLayout extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            width: props.initialWidth ? props.initialWidth : 200
        };
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.initialWidth !== this.state.width) {
            this.setState({ width: nextProps.initialWidth ? nextProps.initialWidth : 200 })
        }
    }

    public render() {
        return (
            <div className="contentFlexContainer" style={{ flexFlow: "row", height: "100%", overflow: "hidden", backgroundColor: "transparent" }}>
                <div className="item item1" style={{ flex: "0 0 " + this.state.width + "px", overflow: "hidden" }}>
                    {this.props.left}
                </div>
                <DraggableCore
                    onStop={this.dragHandler('onResizeStop')}
                    onStart={this.dragHandler('onResizeStart')}
                    onDrag={this.dragHandler('onResize')} >
                    <div className="verticalDivider" style={{ width: this.props.gutter ? this.props.gutter : 8 + "px", backgroundColor: "transparent" }} />
                </DraggableCore>
                <div className="item item2" style={{ flex: "1 0 0px", overflow: "hidden" }}>
                    {this.props.right}
                </div>
            </div>
        );
    }

    private dragHandler = (handlerName: string): DraggableEventHandler => {
        return (e: DraggableEvent, data: DraggableData): void | false => {
            const newWidth = this.state.width + data.deltaX;
            // Early return if no change after constraints
            if (newWidth === this.state.width) { return };
            this.setState({ width: newWidth });
            if (this.props.onWidthChanged) {
                this.props.onWidthChanged(this.props.id, newWidth);
            }
        }
    }
}
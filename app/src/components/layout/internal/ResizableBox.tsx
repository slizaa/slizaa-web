import * as React from 'react';
import { DraggableCore, DraggableData, DraggableEvent, DraggableEventHandler } from 'react-draggable';

import './Layout.css';

export interface IProps {
    id: string
    intitalHeight?: number
    gutterSize?: number
    onHeightChanged?: (id: string, newHeight: number) => void;
}

export interface IState {
    height: number
}

export class ResizableBox extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            height: props.intitalHeight ? props.intitalHeight : 200
        };
    }

    public componentWillReceiveProps(nextProps: IProps) {
        if (nextProps.intitalHeight !== this.state.height) {
            this.setState({ height: nextProps.intitalHeight ? nextProps.intitalHeight : 200 })
        }
    }

    public render() {
        return (
            <div style={{ overflow: "hidden", backgroundColor: "transparent" }}>
                <div style={{ height: this.state.height + "px", overflow: "hidden", backgroundColor: "transparent" }}>
                    {this.props.children}
                </div>
                <DraggableCore
                    onStop={this.dragHandler('onResizeStop')}
                    onStart={this.dragHandler('onResizeStart')}
                    onDrag={this.dragHandler('onResize')}>
                    <div className="horizontalDivider" style={{ height: this.props.gutterSize ? this.props.gutterSize : 8 + "px" }} />
                </DraggableCore>
            </div>
        );
    }

    private dragHandler = (handlerName: string): DraggableEventHandler => {
        return (e: DraggableEvent, data: DraggableData): void | false => {

            const newHeight = this.state.height + data.deltaY;
            this.setState({ height: newHeight })
            if (this.props.onHeightChanged) {
                this.props.onHeightChanged(this.props.id, newHeight);
            }
        }
    }
}
import * as React from 'react';
import { DraggableCore, DraggableData, DraggableEvent, DraggableEventHandler } from 'react-draggable';

import './CommonLayout.css';

export interface IProps {
    id: string
    height: number
    gutter?: number
    component: JSX.Element
    onHeightChanged: (id: string, newHeight: number) => void;
}

export default class ResizableBox extends React.Component<IProps, {}> {

    public render() {
        return (
            <div style={{ overflow: "hidden", backgroundColor: "transparent" }}>
                <div style={{ height: this.props.height + "px", overflow: "hidden", backgroundColor: "transparent" }}>
                   {this.props.component}
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

            const newHeight = this.props.height + data.deltaY;
            this.props.onHeightChanged(this.props.id, newHeight);
        }
    }
}
import * as React from 'react';
import { DraggableCore, DraggableData, DraggableEvent, DraggableEventHandler } from 'react-draggable';

import './CommonLayout.css';

export interface IProps {
    id: string
    width: number
    left: JSX.Element
    right: JSX.Element
    gutter?: number
    onWidthChanged: (id: string, newWidth: number) => void;
}

export default class HorizontalSplitLayout extends React.Component<IProps, {}> {

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
            <div className="contentFlexContainer" style={{ flexFlow: "row", height: "100%", overflow: "hidden", backgroundColor: "transparent" }}>
                <div className="item item1" style={{ flex: "0 0 " + this.props.width + "px", overflow: "hidden" }}>
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
            const newWidth = this.props.width + data.deltaX;
            // Early return if no change after constraints
            if (newWidth === this.props.width) { return };
            this.props.onWidthChanged(this.props.id, newWidth);
        }
    }
}
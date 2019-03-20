import * as React from 'react';
import { setupCanvas } from './DpiFixer';
import './DSM.css';
import { DefaultColorScheme, IDsmColorScheme } from './IDsmColorScheme';

export interface IDsmProps {
    labels: IDsmLabel[];
    cells: IDsmCell[];
    stronglyConnectedComponents: IDsmStronglyConnectedComponent[];
}

export interface IDsmLabel {
    id: string;
    text: string;
}

export interface IDsmCell {
    row: number;
    column: number;
    value: number;
}

export interface IDsmStronglyConnectedComponent {
    nodePositions: number[];
}

export class DSM extends React.Component<IDsmProps> {

    private canvasRef: HTMLCanvasElement | null;

    private renderingContext: CanvasRenderingContext2D | null;

    private colorScheme: IDsmColorScheme = new DefaultColorScheme;

    public componentDidMount() {
        if (this.canvasRef) {
            this.renderingContext = this.canvasRef.getContext("2d")
        }
        this.draw();
    }

    public componentDidUpdate() {
        this.draw();
    }

    public render() {
        return (
            <div>
                <canvas ref={ref => (this.canvasRef = ref)} />
            </div>
        );
    }

    private draw() {

        if (this.canvasRef && this.renderingContext) {

            const renderingContext2D = this.renderingContext;
            const horizontalSliceSize = this.getHorizontalSliceSize;
            const verticalSliceSize = this.getVerticalSliceSize;
            const boxSize = this.getBoxSize;

            const scaleFactor = 1;
            const itemCount = this.props.labels.length
            const width = horizontalSliceSize(itemCount) * scaleFactor + 70;
            const height = verticalSliceSize(itemCount) * scaleFactor + 70;

            setupCanvas(this.canvasRef, renderingContext2D, width, height);

            // set the scale factor
            renderingContext2D.scale(1, scaleFactor);

            // draw the matrix
            renderingContext2D.translate(70, 70);

            // draw the background for the complete matrix
            renderingContext2D.fillStyle = this.colorScheme.getMatrixBackgroundColor();
            renderingContext2D.fillRect(0, 0, width, height);

            // draw the diagonal
            renderingContext2D.fillStyle = this.colorScheme.getMatrixDiagonalColor();
            for (let index = 0; index < itemCount; index++) {
                renderingContext2D.fillRect(horizontalSliceSize(index), verticalSliceSize(index),
                    horizontalSliceSize(index + 1) - horizontalSliceSize(index) + 1,
                    verticalSliceSize(index + 1) - verticalSliceSize(index) + 1);
            }

            // draw the strongly connected components
            renderingContext2D.fillStyle = this.colorScheme.getCycleSideMarkerColor();
            this.props.stronglyConnectedComponents.forEach(cycle => {

                // extract the node positions
                const nodePositions = cycle.nodePositions;

                renderingContext2D.fillRect(horizontalSliceSize(nodePositions[0]), verticalSliceSize(nodePositions[0]),
                    horizontalSliceSize(nodePositions.length) + 1, verticalSliceSize(nodePositions.length) + 1);

                renderingContext2D.fillStyle = this.colorScheme.getCycleMatrixDiagonalColor();
                for (const position of nodePositions) {
                    renderingContext2D.fillRect(horizontalSliceSize(position), verticalSliceSize(position),
                        horizontalSliceSize(position + 1) - horizontalSliceSize(position) + 1,
                        verticalSliceSize(position + 1) - verticalSliceSize(position) + 1);
                }
            });

            // draw the text
            renderingContext2D.fillStyle = this.colorScheme.getMatrixTextColor();
            renderingContext2D.font = "14px Arial";
            this.props.cells.forEach(item => {
                if (item.row !== item.column) {
                    if (item.value) {
                        renderingContext2D.textAlign = "center";
                        renderingContext2D.textBaseline = "middle";
                        renderingContext2D.fillText('' + item.value,
                            horizontalSliceSize(item.column) + boxSize().getHorizontalBoxSize() / 2,
                            verticalSliceSize(item.row) + boxSize().getVerticalBoxSize() / 2);
                    }
                }
            });

            // draw the separator lines
            renderingContext2D.strokeStyle = this.colorScheme.getMatrixSeparatorColor();
            for (let index = 0; index <= itemCount; index++) {

                renderingContext2D.beginPath();
                renderingContext2D.moveTo(0, verticalSliceSize(index));
                renderingContext2D.lineTo(boxSize().getHorizontalBoxSize() * itemCount, verticalSliceSize(index));
                renderingContext2D.stroke();

                renderingContext2D.beginPath();
                renderingContext2D.moveTo(horizontalSliceSize(index), 0);
                renderingContext2D.lineTo(horizontalSliceSize(index), boxSize().getVerticalBoxSize() * itemCount);
                renderingContext2D.stroke();
            }

            // draw the cycle separator lines
            renderingContext2D.strokeStyle = this.colorScheme.getCycleSideMarkerSeparatorColor();
            this.props.stronglyConnectedComponents.forEach(cycle => {

                // extract the node positions
                const nodePositions = cycle.nodePositions;
                for (const position of nodePositions) {
                    renderingContext2D.beginPath();
                    renderingContext2D.moveTo(horizontalSliceSize(position), verticalSliceSize(nodePositions[0]));
                    renderingContext2D.lineTo(horizontalSliceSize(position), verticalSliceSize(nodePositions[nodePositions.length - 1] + 1));
                    renderingContext2D.stroke();

                    renderingContext2D.beginPath();
                    renderingContext2D.moveTo(horizontalSliceSize(nodePositions[0]), verticalSliceSize(position));
                    renderingContext2D.lineTo(horizontalSliceSize(nodePositions[nodePositions.length - 1] + 1), verticalSliceSize(position));
                    renderingContext2D.stroke();
                }

                renderingContext2D.beginPath();
                renderingContext2D.moveTo(horizontalSliceSize(nodePositions[nodePositions.length - 1] + 1),
                    verticalSliceSize(nodePositions[0]));
                renderingContext2D.lineTo(horizontalSliceSize(nodePositions[nodePositions.length - 1] + 1),
                    verticalSliceSize(nodePositions[nodePositions.length - 1] + 1));
                renderingContext2D.stroke();

                renderingContext2D.beginPath();
                renderingContext2D.moveTo(horizontalSliceSize(nodePositions[0]),
                    verticalSliceSize(nodePositions[nodePositions.length - 1] + 1));
                renderingContext2D.lineTo(horizontalSliceSize(nodePositions[nodePositions.length - 1] + 1),
                    verticalSliceSize(nodePositions[nodePositions.length - 1] + 1));
                renderingContext2D.stroke();
            });
        }
    }

    private getHorizontalSliceSize = (count: number) => {
        return this.getBoxSize().getHorizontalBoxSize() * count;
    }

	/**
	 * <p>
	 * </p>
	 * 
	 * @param count
	 * @return
	 */
    private getVerticalSliceSize = (count: number) => {
        return this.getBoxSize().getVerticalBoxSize() * count;
    }

    private getBoxSize = () => {
        return {
            getHorizontalBoxSize: () => 40,
            getVerticalBoxSize: () => 40
        };
    }
}
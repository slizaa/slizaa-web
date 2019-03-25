import * as React from 'react';
import { setupCanvas } from './DpiFixer';
import './DSM.css';
import { DefaultColorScheme, IDsmColorScheme } from './IDsmColorScheme';

export interface IState {
    horizontalSideMarkerHeight: number;
    verticalSideMarkerWidth: number;
    // markedCellX: number | undefined;
    // markedCellY: number | undefined;
}

export interface IProps {
    labels: IDsmLabel[];
    cells: IDsmCell[];
    stronglyConnectedComponents: IDsmStronglyConnectedComponent[];
    horizontalBoxSize?: number;
    verticalBoxSize?: number;
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

export class DSM extends React.Component<IProps, IState> {

    private readonly FONT = "12px Arial";

    private canvasRef: HTMLCanvasElement | null;
    private renderingContext: CanvasRenderingContext2D | null;

    private markedCellLayerCanvasRef: HTMLCanvasElement | null;
    private markedCellLayerrenderingContext: CanvasRenderingContext2D | null;

    private colorScheme: IDsmColorScheme = new DefaultColorScheme;

    private mouseDown: boolean;
    private currentMarkedX: number | undefined;
    private currentMarkedY: number | undefined;
    private newMarkedX: number | undefined;
    private newMarkedY: number | undefined;
    private sccNodePositions: number[];
    private matrixLabels: string[][];

    constructor(props: IProps) {
        super(props);

        this.state = {
            horizontalSideMarkerHeight: 50,
            verticalSideMarkerWidth: 100,
        }
    }

    public componentDidMount() {

        if (this.canvasRef && this.markedCellLayerCanvasRef) {

            this.renderingContext = this.canvasRef.getContext("2d")
            this.markedCellLayerrenderingContext = this.markedCellLayerCanvasRef.getContext("2d")


            if (this.markedCellLayerrenderingContext) {

                this.markedCellLayerrenderingContext.canvas.onmouseenter = ((event: MouseEvent) => {
                    console.log("onmouseenter");
                    this.mouseDown = true;
                    requestAnimationFrame(this.updateMarkedLayer);
                }).bind(this)

                this.markedCellLayerrenderingContext.canvas.onmouseleave = ((event: MouseEvent) => {
                    this.mouseDown = false;
                    this.newMarkedX = undefined;
                    this.newMarkedY = undefined;
                    requestAnimationFrame(this.updateMarkedLayer);
                }).bind(this)

                this.markedCellLayerrenderingContext.canvas.onmousemove = ((event: MouseEvent) => {

                    let x: number | undefined = Math.floor((event.offsetX - this.state.verticalSideMarkerWidth) / this.getBoxSize().getHorizontalBoxSize())
                    let y: number | undefined = Math.floor((event.offsetY - this.state.horizontalSideMarkerHeight) / this.getBoxSize().getVerticalBoxSize())

                    if (x < 0 || x >= this.props.labels.length) { x = undefined }
                    if (y < 0 || y >= this.props.labels.length) { y = undefined }

                    if (this.currentMarkedX !== x || this.currentMarkedY !== y) {
                        this.newMarkedX = x;
                        this.newMarkedY = y;
                    }
                }).bind(this)

                //     // tslint:disable-next-line:no-console
                //     this.renderingContext.canvas.onclick = (event) => console.log("click: " + event);
                //     // https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
                // }
            }
            this.draw();
        }
    }

    public componentDidUpdate() {
        this.draw();
    }

    public render() {
        return (
            <div id="stage">
                <canvas id="markedCellLayer" ref={ref => (this.markedCellLayerCanvasRef = ref)} />
                <canvas id="main" ref={ref => (this.canvasRef = ref)} />
            </div>
        );
    }

    private draw = () => {

        if (this.canvasRef && this.renderingContext && this.markedCellLayerCanvasRef && this.markedCellLayerrenderingContext) {

            const horizontalSliceSize = this.getHorizontalSliceSize;
            const verticalSliceSize = this.getVerticalSliceSize;

            const itemCount = this.props.labels.length
            const width = horizontalSliceSize(itemCount) + this.state.verticalSideMarkerWidth + 2;
            const height = verticalSliceSize(itemCount) + this.state.horizontalSideMarkerHeight + 2;

            //
            this.renderingContext.canvas.width = width;
            this.renderingContext.canvas.height = height;
            this.markedCellLayerrenderingContext.canvas.width = width;
            this.markedCellLayerrenderingContext.canvas.height = height;

            this.setupCanvas();

            // create structures
            this.sccNodePositions = [].concat.apply([], this.props.stronglyConnectedComponents.map(scc => scc.nodePositions));
            this.matrixLabels = new Array(this.props.labels.length);
            for (let index = 0; index < this.matrixLabels.length; index++) {
                this.matrixLabels[index] = new Array(this.props.labels.length);
            }
            this.props.cells.forEach(cell => {
                this.matrixLabels[cell.row][cell.column] = '' + cell.value;
            });

            //
            this.drawMHorizontalBar(this.renderingContext, width, height, this.sccNodePositions);
            this.drawMVerticalBar(this.renderingContext, width, height, this.sccNodePositions);
            this.drawMatrix(this.renderingContext, width, height);
        }
    }

    private drawMHorizontalBar = (renderingContext2D: CanvasRenderingContext2D, width: number, height: number, sccNodePositions: number[]) => {

        // draw the horizontal bar
        renderingContext2D.fillStyle = this.colorScheme.getSideMarkerBackgroundColor();
        renderingContext2D.fillRect(this.state.verticalSideMarkerWidth, 0, width, this.state.horizontalSideMarkerHeight);

        // draw the makers
        for (let i = 0; i < this.props.labels.length; i++) {

            // compute the cycles
            const isInCycle = sccNodePositions.includes(i);

            // draw the "even" marker
            if (isInCycle || i % 2 === 0) {

                // draw the background
                renderingContext2D.fillStyle = isInCycle ? this.colorScheme.getCycleSideMarkerColor() : this.colorScheme.getSideMarkerEvenColor();
                renderingContext2D.fillRect(this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(i), 0,
                    this.getHorizontalSliceSize(i + 1) - this.getHorizontalSliceSize(i), this.state.horizontalSideMarkerHeight);
            }

            //
            renderingContext2D.strokeStyle = isInCycle && sccNodePositions.includes(i - 1) ? this.colorScheme.getCycleSideMarkerSeparatorColor() : this.colorScheme.getSideMarkerSeparatorColor();
            renderingContext2D.beginPath();
            renderingContext2D.moveTo(this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(i), 0);
            renderingContext2D.lineTo(this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(i), this.state.horizontalSideMarkerHeight);
            renderingContext2D.stroke();

            // DRAW HORIZONTAL TEXT
            renderingContext2D.save();

            // CLIPPING
            renderingContext2D.beginPath();
            renderingContext2D.rect(this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(i), 0,
                this.getHorizontalSliceSize(i + 1) - this.getHorizontalSliceSize(i), this.state.horizontalSideMarkerHeight);
            renderingContext2D.clip();

            // ROTATE
            renderingContext2D.translate(this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(i) + this.getBoxSize().getHorizontalBoxSize() / 2, 10);
            renderingContext2D.rotate(1 * Math.PI / 2);

            renderingContext2D.fillStyle = this.colorScheme.getSideMarkerTextColor();
            renderingContext2D.font = this.FONT;
            renderingContext2D.textAlign = "left";
            renderingContext2D.textBaseline = "middle";
            renderingContext2D.fillText(this.props.labels[i].text, 0, 0);

            renderingContext2D.restore();
        }

        // draw the last line
        renderingContext2D.strokeStyle = this.colorScheme.getSideMarkerSeparatorColor();
        renderingContext2D.beginPath();
        renderingContext2D.moveTo(this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(this.props.labels.length), 0);
        renderingContext2D.lineTo(this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(this.props.labels.length), this.state.horizontalSideMarkerHeight);
        renderingContext2D.stroke();
    }

    private drawMVerticalBar = (renderingContext2D: CanvasRenderingContext2D, width: number, height: number, sccNodePositions: number[]) => {

        // draw the vertical bar
        renderingContext2D.fillStyle = this.colorScheme.getSideMarkerBackgroundColor();
        renderingContext2D.fillRect(0, this.state.horizontalSideMarkerHeight, this.state.verticalSideMarkerWidth, this.getVerticalSliceSize(this.props.labels.length));

        // draw the makers
        for (let i = 0; i < this.props.labels.length; i++) {

            //
            const isInCycle = sccNodePositions.includes(i);

            // draw the "even" marker
            if (isInCycle || i % 2 === 0) {

                // draw the background
                renderingContext2D.fillStyle = isInCycle ? this.colorScheme.getCycleSideMarkerColor() : this.colorScheme.getSideMarkerEvenColor();
                renderingContext2D.fillRect(0, this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(i), this.state.verticalSideMarkerWidth,
                    this.getVerticalSliceSize(i + 1) - this.getVerticalSliceSize(i));
            }

            // draw the line
            renderingContext2D.strokeStyle = isInCycle && sccNodePositions.includes(i - 1) ? this.colorScheme.getCycleSideMarkerSeparatorColor() : this.colorScheme.getSideMarkerSeparatorColor();
            renderingContext2D.beginPath();
            renderingContext2D.moveTo(0, this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(i));
            renderingContext2D.lineTo(this.state.verticalSideMarkerWidth, this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(i));
            renderingContext2D.stroke();

            // draw the text
            renderingContext2D.fillStyle = this.colorScheme.getSideMarkerTextColor();
            renderingContext2D.font = this.FONT;
            renderingContext2D.textAlign = "center";
            renderingContext2D.textBaseline = "middle";
            renderingContext2D.fillText(this.props.labels[i].text,
                this.state.verticalSideMarkerWidth / 2,
                this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(i) + this.getBoxSize().getVerticalBoxSize() / 2);
        }

        // draw the last line
        renderingContext2D.strokeStyle = this.colorScheme.getSideMarkerSeparatorColor();
        renderingContext2D.beginPath();
        renderingContext2D.moveTo(0, this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(this.props.labels.length));
        renderingContext2D.lineTo(this.state.verticalSideMarkerWidth, this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(this.props.labels.length));
        renderingContext2D.stroke();
    }

    private drawMatrix = (renderingContext2D: CanvasRenderingContext2D, width: number, height: number) => {

        const horizontalSliceSize = this.getHorizontalSliceSize;
        const verticalSliceSize = this.getVerticalSliceSize;

        // draw the background for the complete matrix
        renderingContext2D.fillStyle = this.colorScheme.getMatrixBackgroundColor();
        renderingContext2D.fillRect(this.state.verticalSideMarkerWidth, this.state.horizontalSideMarkerHeight, width, height);

        // draw the diagonal
        renderingContext2D.fillStyle = this.colorScheme.getMatrixDiagonalColor();
        for (let index = 0; index < this.props.labels.length; index++) {
            renderingContext2D.fillRect(this.state.verticalSideMarkerWidth + horizontalSliceSize(index), this.state.horizontalSideMarkerHeight + verticalSliceSize(index),
                horizontalSliceSize(index + 1) - horizontalSliceSize(index),
                verticalSliceSize(index + 1) - verticalSliceSize(index));
        }

        // draw the strongly connected components
        renderingContext2D.fillStyle = this.colorScheme.getCycleSideMarkerColor();
        this.props.stronglyConnectedComponents.forEach(cycle => {

            // extract the node positions
            const nodePositions = cycle.nodePositions;

            renderingContext2D.fillRect(this.state.verticalSideMarkerWidth + horizontalSliceSize(nodePositions[0]), this.state.horizontalSideMarkerHeight + verticalSliceSize(nodePositions[0]),
                horizontalSliceSize(nodePositions.length) + 1, verticalSliceSize(nodePositions.length) + 1);

            renderingContext2D.fillStyle = this.colorScheme.getCycleMatrixDiagonalColor();
            for (const position of nodePositions) {
                renderingContext2D.fillRect(this.state.verticalSideMarkerWidth + horizontalSliceSize(position), this.state.horizontalSideMarkerHeight + verticalSliceSize(position),
                    horizontalSliceSize(position + 1) - horizontalSliceSize(position) + 1,
                    verticalSliceSize(position + 1) - verticalSliceSize(position) + 1);
            }
        });

        // draw the text
        renderingContext2D.fillStyle = this.colorScheme.getMatrixTextColor();
        renderingContext2D.font = this.FONT;
        this.props.cells.forEach(item => {
            if (item.row !== item.column) {
                if (item.value) {
                    renderingContext2D.textAlign = "center";
                    renderingContext2D.textBaseline = "middle";
                    renderingContext2D.fillText('' + item.value,
                        this.state.verticalSideMarkerWidth + horizontalSliceSize(item.column) + this.getBoxSize().getHorizontalBoxSize() / 2,
                        this.state.horizontalSideMarkerHeight + verticalSliceSize(item.row) + this.getBoxSize().getVerticalBoxSize() / 2);
                }
            }
        });

        // draw the separator lines
        renderingContext2D.strokeStyle = this.colorScheme.getMatrixSeparatorColor();
        renderingContext2D.beginPath();
        for (let index = 0; index <= this.props.labels.length; index++) {

            renderingContext2D.moveTo(this.state.verticalSideMarkerWidth, this.state.horizontalSideMarkerHeight + verticalSliceSize(index));
            renderingContext2D.lineTo(this.state.verticalSideMarkerWidth + this.getBoxSize().getHorizontalBoxSize() * this.props.labels.length, this.state.horizontalSideMarkerHeight + verticalSliceSize(index));

            renderingContext2D.moveTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(index), this.state.horizontalSideMarkerHeight);
            renderingContext2D.lineTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(index), this.state.horizontalSideMarkerHeight + this.getBoxSize().getVerticalBoxSize() * this.props.labels.length);
        }
        renderingContext2D.stroke();

        // draw the cycle separator lines
        renderingContext2D.strokeStyle = this.colorScheme.getCycleSideMarkerSeparatorColor();
        renderingContext2D.beginPath();

        this.props.stronglyConnectedComponents.forEach(cycle => {
            for (const position of cycle.nodePositions) {

                renderingContext2D.moveTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(position),
                    this.state.horizontalSideMarkerHeight + verticalSliceSize(cycle.nodePositions[0]));
                renderingContext2D.lineTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(position),
                    this.state.horizontalSideMarkerHeight + verticalSliceSize(cycle.nodePositions[cycle.nodePositions.length - 1] + 1));

                renderingContext2D.moveTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(cycle.nodePositions[0]),
                    this.state.horizontalSideMarkerHeight + verticalSliceSize(position));
                renderingContext2D.lineTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(cycle.nodePositions[cycle.nodePositions.length - 1] + 1),
                    this.state.horizontalSideMarkerHeight + verticalSliceSize(position));
            }

            renderingContext2D.moveTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(cycle.nodePositions[cycle.nodePositions.length - 1] + 1),
                this.state.horizontalSideMarkerHeight + verticalSliceSize(cycle.nodePositions[0]));
            renderingContext2D.lineTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(cycle.nodePositions[cycle.nodePositions.length - 1] + 1),
                this.state.horizontalSideMarkerHeight + verticalSliceSize(cycle.nodePositions[cycle.nodePositions.length - 1] + 1));

            renderingContext2D.moveTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(cycle.nodePositions[0]),
                this.state.horizontalSideMarkerHeight + verticalSliceSize(cycle.nodePositions[cycle.nodePositions.length - 1] + 1));
            renderingContext2D.lineTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(cycle.nodePositions[cycle.nodePositions.length - 1] + 1),
                this.state.horizontalSideMarkerHeight + verticalSliceSize(cycle.nodePositions[cycle.nodePositions.length - 1] + 1));

            renderingContext2D.stroke();
        });
    }

    private updateMarkedLayer = () => {

        // only redraw on change
        if (this.currentMarkedX !== this.newMarkedX || this.currentMarkedY !== this.newMarkedY) {

            //
            if (this.markedCellLayerCanvasRef && this.markedCellLayerrenderingContext) {

                // clear rect
                if (this.currentMarkedX !== undefined && this.currentMarkedY !== undefined) {
                    // Store the current transformation matrix
                    this.markedCellLayerrenderingContext.save();

                    // Use the identity matrix while clearing the canvas
                    this.markedCellLayerrenderingContext.setTransform(1, 0, 0, 1, 0, 0);
                    this.markedCellLayerrenderingContext.clearRect(0, 0, this.markedCellLayerrenderingContext.canvas.width, this.markedCellLayerrenderingContext.canvas.height);

                    // Restore the transform
                    this.markedCellLayerrenderingContext.restore();
                }

                //
                this.currentMarkedX = this.newMarkedX;
                this.currentMarkedY = this.newMarkedY;

                //
                if (this.currentMarkedX !== undefined && this.currentMarkedY !== undefined) {

                    for (let index = 0; index <= this.currentMarkedX; index++) {
                        this.markCell(index, this.currentMarkedY);
                    }
                    for (let index = 0; index <= this.currentMarkedY; index++) {
                        this.markCell(this.currentMarkedX, index);
                    }
                    this.markCell(this.currentMarkedY, this.currentMarkedX);

                    // vertical bar
                    this.markedCellLayerrenderingContext.fillStyle = this.isLabelInCycle(this.currentMarkedY) ? this.colorScheme.getCycleSideMarkerMarkedColor() : this.colorScheme.getSideMarkerMarkedColor();
                    this.markedCellLayerrenderingContext.fillRect(0,
                        this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(this.currentMarkedY),
                        this.state.verticalSideMarkerWidth,
                        this.getVerticalSliceSize(this.currentMarkedY + 1) - this.getVerticalSliceSize(this.currentMarkedY));

                    this.markedCellLayerrenderingContext.fillStyle = this.colorScheme.getSideMarkerTextColor();
                    this.markedCellLayerrenderingContext.font = this.FONT;
                    this.markedCellLayerrenderingContext.textAlign = "center";
                    this.markedCellLayerrenderingContext.textBaseline = "middle";
                    this.markedCellLayerrenderingContext.fillText(this.props.labels[this.currentMarkedY].text,
                        this.state.verticalSideMarkerWidth / 2,
                        this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(this.currentMarkedY) + this.getBoxSize().getVerticalBoxSize() / 2);
                }
            }
        }

        if (this.mouseDown) {
            requestAnimationFrame(this.updateMarkedLayer);
        }
    }

    private markCell = (x: number, y: number) => {

        if (this.markedCellLayerrenderingContext) {

            this.markedCellLayerrenderingContext.fillStyle = this.isCellInCycle(x, y) ? this.colorScheme.getCycleMatrixMarkedCellColor() : this.colorScheme.getMatrixMarkedCellColor();
            this.markedCellLayerrenderingContext.fillRect(
                this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(x),
                this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(y),
                this.getBoxSize().getHorizontalBoxSize(),
                this.getBoxSize().getVerticalBoxSize());

            this.markedCellLayerrenderingContext.fillStyle = this.colorScheme.getMatrixTextColor();
            this.markedCellLayerrenderingContext.font = this.FONT;
            this.markedCellLayerrenderingContext.textAlign = "center";
            this.markedCellLayerrenderingContext.textBaseline = "middle";
            this.markedCellLayerrenderingContext.fillText(this.matrixLabels[x][y],
                this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(x) + this.getBoxSize().getHorizontalBoxSize() / 2,
                this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(y) + this.getBoxSize().getVerticalBoxSize() / 2);
        }
    }

    private setupCanvas = () => {
        if (this.canvasRef && this.renderingContext) {
            setupCanvas(this.canvasRef, this.renderingContext);
        }
        if (this.markedCellLayerCanvasRef && this.markedCellLayerrenderingContext) {
            setupCanvas(this.markedCellLayerCanvasRef, this.markedCellLayerrenderingContext);
        }
    }

    private getHorizontalSliceSize = (count: number) => {
        return this.getBoxSize().getHorizontalBoxSize() * count;
    }

    private getVerticalSliceSize = (count: number) => {
        return this.getBoxSize().getVerticalBoxSize() * count;
    }

    private getBoxSize = () => {
        return {
            getHorizontalBoxSize: () => this.props.horizontalBoxSize ? this.props.horizontalBoxSize : 25,
            getVerticalBoxSize: () => this.props.verticalBoxSize ? this.props.verticalBoxSize : 25
        };
    }

    private isLabelInCycle = (index: number) => {

        if (this.sccNodePositions === undefined || this.sccNodePositions === null) {
            this.sccNodePositions = [].concat.apply([], this.props.stronglyConnectedComponents.map(scc => scc.nodePositions));
        }

        return this.sccNodePositions.includes(index);
    }

    private isCellInCycle = (x: number, y: number) => {

        if (this.props.stronglyConnectedComponents) {
            for (let index = 0; index < this.props.stronglyConnectedComponents.length; index++) {
                const scc = this.props.stronglyConnectedComponents[index];
                if (scc.nodePositions.includes(x) && scc.nodePositions.includes(y)) {
                    return true;
                }
            }
        }

        return false;
    }
}
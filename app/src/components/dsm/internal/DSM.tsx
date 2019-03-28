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
    initialHorizontalSideMarkerHeight?: number;
    intialVerticalSideMarkerWidth?: number;
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
    private readonly SEP_SIZE = 4;
    private readonly TEXT_CLIP_PADDING = 5;

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

            //
            this.setupCanvas();

            // create structures
            this.sccNodePositions = [].concat.apply([], this.props.stronglyConnectedComponents.map(scc => scc.nodePositions));
            this.matrixLabels = new Array(this.props.labels.length);
            for (let index = 0; index < this.matrixLabels.length; index++) {
                this.matrixLabels[index] = new Array(this.props.labels.length);
            }
            this.props.cells.forEach(cell => {
                this.matrixLabels[cell.column][cell.row] = '' + cell.value;
            });

            // draw the horizontal bar
            for (let i = 0; i < this.props.labels.length; i++) {
                this.drawHorizontalBar(i, this.renderingContext, false);
            }
            // draw the vertical bar
            for (let i = 0; i < this.props.labels.length; i++) {
                this.drawVerticalBar(i, this.renderingContext, false);
            }
            // this.drawMVerticalBar(this.renderingContext, width, height, this.sccNodePositions);
            this.drawMatrix(this.renderingContext, width, height);
        }
    }

    private drawMatrix = (renderingContext2D: CanvasRenderingContext2D, width: number, height: number) => {

        const horizontalSliceSize = this.getHorizontalSliceSize;
        const verticalSliceSize = this.getVerticalSliceSize;

        // draw the background for the complete matrix
        renderingContext2D.fillStyle = this.colorScheme.getMatrixBackgroundColor();
        renderingContext2D.fillRect(this.state.verticalSideMarkerWidth, this.state.horizontalSideMarkerHeight, horizontalSliceSize(this.props.labels.length), verticalSliceSize(this.props.labels.length));

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
                horizontalSliceSize(nodePositions.length), verticalSliceSize(nodePositions.length));

            renderingContext2D.fillStyle = this.colorScheme.getCycleMatrixDiagonalColor();
            for (const position of nodePositions) {
                renderingContext2D.fillRect(this.state.verticalSideMarkerWidth + horizontalSliceSize(position), this.state.horizontalSideMarkerHeight + verticalSliceSize(position),
                    horizontalSliceSize(position + 1) - horizontalSliceSize(position),
                    verticalSliceSize(position + 1) - verticalSliceSize(position));
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

            // tslint:disable-next-line:prefer-for-of
            for (let index = 1; index < cycle.nodePositions.length; index++) {

                renderingContext2D.moveTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(cycle.nodePositions[index]),
                    this.state.horizontalSideMarkerHeight + verticalSliceSize(cycle.nodePositions[0]));
                renderingContext2D.lineTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(cycle.nodePositions[index]),
                    this.state.horizontalSideMarkerHeight + verticalSliceSize(cycle.nodePositions[cycle.nodePositions.length - 1] + 1));

                renderingContext2D.moveTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(cycle.nodePositions[0]),
                    this.state.horizontalSideMarkerHeight + verticalSliceSize(cycle.nodePositions[index]));
                renderingContext2D.lineTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(cycle.nodePositions[cycle.nodePositions.length - 1] + 1),
                    this.state.horizontalSideMarkerHeight + verticalSliceSize(cycle.nodePositions[index]));
            }

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

                    this.markCell(this.currentMarkedX, this.currentMarkedY);
                    this.markCell(this.currentMarkedY, this.currentMarkedX);

                    // mark vertical bar
                    this.drawVerticalBar(this.currentMarkedY, this.markedCellLayerrenderingContext, true);

                    // mark horizontal bar
                    this.drawHorizontalBar(this.currentMarkedX, this.markedCellLayerrenderingContext, true);
                }
            }
        }

        if (this.mouseDown) {
            requestAnimationFrame(this.updateMarkedLayer);
        }
    }

    private drawVerticalBar = (y: number, renderingContext: CanvasRenderingContext2D, mark: boolean) => {

        renderingContext.save();

        const isInCycle = this.isLabelInCycle(y);

        // step 1: fill the rect
        if (mark) {
            renderingContext.fillStyle = isInCycle ? this.colorScheme.getCycleSideMarkerMarkedColor() : this.colorScheme.getSideMarkerMarkedColor();
        } else {
            renderingContext.fillStyle = isInCycle ? this.colorScheme.getCycleSideMarkerColor() : this.colorScheme.getSideMarkerBackgroundColor();
        }

        renderingContext.fillRect(
            0,
            this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(y),
            this.state.verticalSideMarkerWidth - this.SEP_SIZE,
            this.getVerticalSliceSize(y + 1) - this.getVerticalSliceSize(y));

        // step 2: separators   
        renderingContext.strokeStyle = isInCycle ? this.colorScheme.getCycleSideMarkerSeparatorColor() : this.colorScheme.getSideMarkerSeparatorColor();
        renderingContext.beginPath();
        renderingContext.moveTo(0, this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(y));
        renderingContext.lineTo(this.state.verticalSideMarkerWidth - this.SEP_SIZE, this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(y));
        renderingContext.moveTo(this.state.verticalSideMarkerWidth - this.SEP_SIZE, this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(y));
        renderingContext.lineTo(this.state.verticalSideMarkerWidth - this.SEP_SIZE, this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(y + 1));
        if (y === this.props.labels.length - 1) {
            renderingContext.moveTo(0, this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(this.props.labels.length));
            renderingContext.lineTo(this.state.verticalSideMarkerWidth - this.SEP_SIZE, this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(this.props.labels.length));
        }
        renderingContext.stroke();

        // step 3: re-draw the text
        // ...set the clipping area
        renderingContext.beginPath();
        renderingContext.rect(
            0,
            this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(y),
            this.state.verticalSideMarkerWidth - (this.SEP_SIZE + this.TEXT_CLIP_PADDING),
            this.getVerticalSliceSize(y + 1) - this.getVerticalSliceSize(y));
        renderingContext.clip();

        // ...draw rotated text
        renderingContext.fillStyle = this.colorScheme.getSideMarkerTextColor();
        renderingContext.font = this.FONT;
        renderingContext.textAlign = "left";
        renderingContext.textBaseline = "middle";
        renderingContext.fillText(this.props.labels[y].text,
            10,
            this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(y) + this.getBoxSize().getVerticalBoxSize() / 2);

        renderingContext.restore();
    }

    private drawHorizontalBar = (x: number, renderingContext: CanvasRenderingContext2D, mark: boolean) => {

        renderingContext.save();

        const isInCycle = this.isLabelInCycle(x);

        // step 1: fill the rect
        if (mark) {
            renderingContext.fillStyle = isInCycle ? this.colorScheme.getCycleSideMarkerMarkedColor() : this.colorScheme.getSideMarkerMarkedColor();
        } else {
            renderingContext.fillStyle = isInCycle ? this.colorScheme.getCycleSideMarkerColor() : this.colorScheme.getSideMarkerBackgroundColor();
        }

        renderingContext.fillRect(
            this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(x),
            0,
            this.getHorizontalSliceSize(x + 1) - this.getHorizontalSliceSize(x),
            this.state.horizontalSideMarkerHeight - this.SEP_SIZE);

        // step 2: separators
        renderingContext.strokeStyle = isInCycle ? this.colorScheme.getCycleSideMarkerSeparatorColor() : this.colorScheme.getSideMarkerSeparatorColor();
        renderingContext.beginPath();
        renderingContext.moveTo(this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(x), 0);
        renderingContext.lineTo(this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(x), this.state.horizontalSideMarkerHeight - this.SEP_SIZE);
        renderingContext.moveTo(this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(x), this.state.horizontalSideMarkerHeight - this.SEP_SIZE);
        renderingContext.lineTo(this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(x + 1), this.state.horizontalSideMarkerHeight - this.SEP_SIZE);
        if (x === this.props.labels.length - 1) {
            renderingContext.moveTo(this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(this.props.labels.length), 0);
            renderingContext.lineTo(this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(this.props.labels.length), this.state.horizontalSideMarkerHeight - this.SEP_SIZE);
        }
        renderingContext.stroke();

        // step 2: re-draw the text
        // ...set the clipping area
        renderingContext.beginPath();
        renderingContext.rect(this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(x), 0,
            this.getHorizontalSliceSize(x + 1) - this.getHorizontalSliceSize(x), this.state.horizontalSideMarkerHeight - (this.SEP_SIZE + this.TEXT_CLIP_PADDING));
        renderingContext.clip();

        // ...draw rotated text
        renderingContext.translate(this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(x) + this.getBoxSize().getHorizontalBoxSize() / 2, 10);
        renderingContext.rotate(1 * Math.PI / 2);
        renderingContext.fillStyle = this.colorScheme.getSideMarkerTextColor();
        renderingContext.font = this.FONT;
        renderingContext.textAlign = "left";
        renderingContext.textBaseline = "middle";
        renderingContext.fillText(this.props.labels[x].text, 0, 0);

        renderingContext.restore();
    }

    private markCell = (x: number, y: number) => {

        if (this.markedCellLayerrenderingContext) {

            this.markedCellLayerrenderingContext.save();

            this.markedCellLayerrenderingContext.strokeStyle = this.isCellInCycle(x, y) ? this.colorScheme.getCycleMatrixMarkedCellColor() : this.colorScheme.getMatrixMarkedCellColor();
            this.markedCellLayerrenderingContext.lineWidth = 3;
            this.markedCellLayerrenderingContext.strokeRect(
                this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(x) + 1,
                this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(y) + 1,
                this.getBoxSize().getHorizontalBoxSize() - 2,
                this.getBoxSize().getVerticalBoxSize() - 2);

            this.markedCellLayerrenderingContext.restore();
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
            for (const scc of this.props.stronglyConnectedComponents) {
                if (scc.nodePositions.includes(x) && scc.nodePositions.includes(y)) {
                    return true;
                }
            }
        }

        return false;
    }
}
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

    private updateMarkedLayer = () => {

        // return immediately if nothing has
        if (this.currentMarkedX === this.newMarkedX && this.currentMarkedY === this.newMarkedY) {
            if (this.mouseDown) {
                requestAnimationFrame(this.updateMarkedLayer);
            }
            return;
        }

        //
        if (this.markedCellLayerCanvasRef && this.markedCellLayerrenderingContext) {

            // clear rect
            if (this.currentMarkedX !== undefined && this.currentMarkedY !== undefined) {

                this.markedCellLayerrenderingContext.clearRect(
                    this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(this.currentMarkedX),
                    this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(this.currentMarkedY),
                    this.getBoxSize().getHorizontalBoxSize(),
                    this.getBoxSize().getVerticalBoxSize());
            }

            //
            this.currentMarkedX = this.newMarkedX;
            this.currentMarkedY = this.newMarkedY;

            if (this.currentMarkedX !== undefined && this.currentMarkedY !== undefined) {

                

                // renderingContext2D.fillStyle = this.colorScheme.getMatrixMarkedCellColor();
                // if (this.state.markedCellX !== undefined && this.state.markedCellY !== undefined) {


                //         // draw column
                //         renderingContext2D.fillStyle = sccNodePositions.includes(this.state.markedCellX) || sccNodePositions.includes(this.state.markedCellY) ?
                //             this.colorScheme.getCycleMatrixMarkedColumnRowColor() :
                //             this.colorScheme.getMatrixMarkedColumnRowColor();

                this.markedCellLayerrenderingContext.fillStyle = this.colorScheme.getMatrixMarkedCellColor();
                this.markedCellLayerrenderingContext.fillRect(
                    this.state.verticalSideMarkerWidth + this.getHorizontalSliceSize(this.currentMarkedX) + 1,
                    this.state.horizontalSideMarkerHeight + this.getVerticalSliceSize(this.currentMarkedY) + 1,
                    this.getBoxSize().getHorizontalBoxSize() - 2,
                    this.getBoxSize().getVerticalBoxSize() - 2);
            }
        }

        if (this.mouseDown) {
            requestAnimationFrame(this.updateMarkedLayer);
        }
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

            // scc node positions
            this.sccNodePositions = [].concat.apply([], this.props.stronglyConnectedComponents.map(scc => scc.nodePositions));

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
            renderingContext2D.font = "14px Arial";
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



        ///

        // renderingContext2D.fillStyle = this.colorScheme.getMatrixMarkedCellColor();
        // if (this.state.markedCellX !== undefined && this.state.markedCellY !== undefined) {


        //         // draw column
        //         renderingContext2D.fillStyle = sccNodePositions.includes(this.state.markedCellX) || sccNodePositions.includes(this.state.markedCellY) ?
        //             this.colorScheme.getCycleMatrixMarkedColumnRowColor() :
        //             this.colorScheme.getMatrixMarkedColumnRowColor();

        //             renderingContext2D.fillRect(this.state.verticalSideMarkerWidth + horizontalSliceSize(this.state.markedCellX ), this.state.horizontalSideMarkerHeight,
        //             horizontalSliceSize(this.state.markedCellX + 1) - horizontalSliceSize(this.state.markedCellX), verticalSliceSize(this.state.markedCellY + 1));

        // // draw row
        // graphics.fillRectangle(getHorizontalSliceSize(_x), 0,
        //         getHorizontalSliceSize(_x + 1) - getHorizontalSliceSize(_x) + 1, getVerticalSliceSize(_y + 1));

        // // draw marked cell
        // if (_dsmContentProvider.isInCycle(_x, _y)) {
        //     graphics.setBackgroundColor(getMatrixConfiguration().getCycleMatrixMarkedCellColor());
        // } else {
        //     graphics.setBackgroundColor(getMatrixConfiguration().getMatrixMarkedCellColor());
        // }
        // graphics.fillRectangle(getHorizontalSliceSize(_x), getVerticalSliceSize(_y),
        //         getHorizontalSliceSize(_x + 1) - getHorizontalSliceSize(_x),
        //         getVerticalSliceSize(_y + 1) - getVerticalSliceSize(_y));
        // graphics.fillRectangle(getHorizontalSliceSize(_y), getVerticalSliceSize(_x),
        //         getHorizontalSliceSize(_y + 1) - getHorizontalSliceSize(_y),
        //         getVerticalSliceSize(_x + 1) - getVerticalSliceSize(_x));


        /////


        // renderingContext2D.fillRect(this.getHorizontalSliceSize(this.state.markedCellX) + 1, this.getVerticalSliceSize(this.state.markedCellY) + 1,
        //     this.getHorizontalSliceSize(this.state.markedCellX + 1) - (this.getHorizontalSliceSize(this.state.markedCellX) + 2),
        //     this.getVerticalSliceSize(this.state.markedCellY + 1) - (this.getVerticalSliceSize(this.state.markedCellY) + 2));

        // // draw the text
        // renderingContext2D.fillStyle = this.colorScheme.getMatrixTextColor();
        // renderingContext2D.font = "14px Arial";
        // renderingContext2D.textAlign = "center";
        // renderingContext2D.textBaseline = "middle";
        // renderingContext2D.fillText('BU', this.getHorizontalSliceSize(this.state.markedCellX) + this.getBoxSize().getHorizontalBoxSize() / 2,
        //     this.getVerticalSliceSize(this.state.markedCellY) + this.getBoxSize().getVerticalBoxSize() / 2);

        // }

        //////
        ///


        // draw the text
        renderingContext2D.fillStyle = this.colorScheme.getMatrixTextColor();
        renderingContext2D.font = "14px Arial";
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
        for (let index = 0; index <= this.props.labels.length; index++) {

            renderingContext2D.beginPath();
            renderingContext2D.moveTo(this.state.verticalSideMarkerWidth, this.state.horizontalSideMarkerHeight + verticalSliceSize(index));
            renderingContext2D.lineTo(this.state.verticalSideMarkerWidth + this.getBoxSize().getHorizontalBoxSize() * this.props.labels.length, this.state.horizontalSideMarkerHeight + verticalSliceSize(index));
            renderingContext2D.stroke();

            renderingContext2D.beginPath();
            renderingContext2D.moveTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(index), this.state.horizontalSideMarkerHeight);
            renderingContext2D.lineTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(index), this.state.horizontalSideMarkerHeight + this.getBoxSize().getVerticalBoxSize() * this.props.labels.length);
            renderingContext2D.stroke();
        }

        // draw the cycle separator lines
        renderingContext2D.strokeStyle = this.colorScheme.getCycleSideMarkerSeparatorColor();
        this.props.stronglyConnectedComponents.forEach(cycle => {

            // extract the node positions
            const nodePositions = cycle.nodePositions;
            for (const position of nodePositions) {
                renderingContext2D.beginPath();
                renderingContext2D.moveTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(position),
                    this.state.horizontalSideMarkerHeight + verticalSliceSize(nodePositions[0]));
                renderingContext2D.lineTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(position),
                    this.state.horizontalSideMarkerHeight + verticalSliceSize(nodePositions[nodePositions.length - 1] + 1));
                renderingContext2D.stroke();

                renderingContext2D.beginPath();
                renderingContext2D.moveTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(nodePositions[0]),
                    this.state.horizontalSideMarkerHeight + verticalSliceSize(position));
                renderingContext2D.lineTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(nodePositions[nodePositions.length - 1] + 1),
                    this.state.horizontalSideMarkerHeight + verticalSliceSize(position));
                renderingContext2D.stroke();
            }

            renderingContext2D.beginPath();
            renderingContext2D.moveTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(nodePositions[nodePositions.length - 1] + 1),
                this.state.horizontalSideMarkerHeight + verticalSliceSize(nodePositions[0]));
            renderingContext2D.lineTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(nodePositions[nodePositions.length - 1] + 1),
                this.state.horizontalSideMarkerHeight + verticalSliceSize(nodePositions[nodePositions.length - 1] + 1));
            renderingContext2D.stroke();

            renderingContext2D.beginPath();
            renderingContext2D.moveTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(nodePositions[0]),
                this.state.horizontalSideMarkerHeight + verticalSliceSize(nodePositions[nodePositions.length - 1] + 1));
            renderingContext2D.lineTo(this.state.verticalSideMarkerWidth + horizontalSliceSize(nodePositions[nodePositions.length - 1] + 1),
                this.state.horizontalSideMarkerHeight + verticalSliceSize(nodePositions[nodePositions.length - 1] + 1));
            renderingContext2D.stroke();
        });
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
            getHorizontalBoxSize: () => 50,
            getVerticalBoxSize: () => 40
        };
    }
}
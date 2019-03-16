import { select } from 'd3-selection';
import * as React from 'react';
import './DSM.css';

interface ICell {
  row: number;
  column: number;
  value: number;
}

interface ILabel {
  id: string;
  text: string;
}

interface IDsmProps {
  cells: ICell[];
  labels: ILabel[];
  width: number;
  height: number;
}

interface InternalNode {
  id: string;
  x: number;
  y: number;
  weight: number;
}

export default class DSM extends React.Component<IDsmProps> {
  private svgRef?: SVGElement | null;

  public componentDidMount() {
    this.createAdjacencyMatrix(this.props.labels, this.props.cells);
  }

  public componentWillReceiveProps(nextProps: IDsmProps) {
    // if (nextProps.nodes !== this.props.nodes && nextProps.dependencies !== this.props.dependencies) {
    //   this.createAdjacencyMatrix(this.props.nodes, this.props.dependencies);
    // }
    this.createAdjacencyMatrix(this.props.labels, this.props.cells);
  }

  public render() {
    const { width, height } = this.props;
    return (
      <svg width={width} height={height} ref={ref => (this.svgRef = ref)} />
    );
  }

  private createAdjacencyMatrix(labels: ILabel[], cells: ICell[]) {

    const edgeHash = {};
    cells.forEach(cell => {
      const id = `${cell.row}-${cell.column}`;
      edgeHash[id] = cell;
    });

    const matrix: InternalNode[] = [];
    labels.forEach((source, a) => {
      labels.forEach((target, b) => {
        const grid = {
          id: `${source.id}-${target.id}`,
          weight: 0,
          x: b,
          y: a
        };
        if (edgeHash[grid.id]) {
          grid.weight = edgeHash[grid.id].weight;
        }
        matrix.push(grid);
      });
    });

    const svg = select(this.svgRef!);
    const size = 40;

    // grid
    svg
      .append("g")
      .attr("transform", "translate(50,50)")
      .attr("id", "adjacencyG")
      .selectAll("rect")
      .data(matrix)
      .enter()
      .append("rect")
      .attr("class", "grid")
      .attr("width", size)
      .attr("height", size)
      .attr("x", d => d.x * size)
      .attr("y", d => d.y * size)
      .style("fill-opacity", d => d.weight * .2)
      .exit()
      .remove();

    // text above
    svg
      .append("g")
      .selectAll("text")
      .data(labels)
      .enter()
      .append("g").append("text")
      .attr("transform", "rotate(90 50 50)")
      .attr("y", (d, i) => i * size + size / 2)
      .attr("x", 0)
      .text(d => d.text)
      .style("text-anchor", "right")
      .exit()
      .remove();

    // label.append("rect")
    //   .attr("x", (d, i) => i * size + size/2)
    //   .attr("y", 0)
    //    .attr("width",  40)
    //    .attr("height",  50)
    //    .style("fill", "rgb(123,24,255)");

    // label.append("text")
    // .attr("transform", "translate(50,10)")
    // .attr("x", (d, i) => i * size + size/2)
    // .text(d => d.text)
    // .style("text-anchor", "middle");

    svg
      .append("g")
      .attr("transform", "translate(45,50)")
      .selectAll("text")
      .data(labels)
      .enter()
      .append("text")
      .attr("y", (d, i) => i * size + size / 2)
      .text(d => d.text)
      .exit()
      .remove();

    //   svg.
    //       selectAll("rect.grid").on("mouseover", gridOver);

    //  function gridOver(d) {
    //     selectAll("rect")
    //       .style("stroke-width", function (p) {
    //         return p.x == d.x || p.y == d.y ? "4px" : "1px";
    //       });
    //   }
  }
}
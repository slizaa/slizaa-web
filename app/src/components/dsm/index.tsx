import { select } from 'd3-selection';
import * as React from 'react';
import './DSM.css';

interface IDependency {
  source: number;
  target: number;
}

interface INode {
  id: string;
  text: string;
}

interface IDsmProps {
  dependencies: IDependency[];
  nodes: INode[];
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
    this.createAdjacencyMatrix(this.props.nodes, this.props.dependencies);
  }

  public componentWillReceiveProps(nextProps: IDsmProps) {
    // if (nextProps.nodes !== this.props.nodes && nextProps.dependencies !== this.props.dependencies) {
    //   this.createAdjacencyMatrix(this.props.nodes, this.props.dependencies);
    // }
  }

  public render() {
    const { width, height } = this.props;
    return (
      <svg width={width} height={height} ref={ref => (this.svgRef = ref)} />
    );
  }

  private createAdjacencyMatrix(nodes: INode[], dependencies: IDependency[]) {

    const edgeHash = {};
    dependencies.forEach(dep => {
      const id = `${dep.source}-${dep.target}`;
      edgeHash[id] = dep;
    });

    const matrix: InternalNode[] = [];
    nodes.forEach((source, a) => {
      nodes.forEach((target, b) => {
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
      .style("fill-opacity", d => d.weight * .2);

      // text above
      const label = svg
        .append("g")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("g");

      // label.append("rect")
      //   .attr("x", (d, i) => i * size + size/2)
      //   .attr("y", 0)
      //    .attr("width",  40)
      //    .attr("height",  50)
      //    .style("fill", "rgb(123,24,255)");

      label.append("text")
        .attr("transform", "rotate(90 50 50)")
        .attr("y", (d, i) => i * size + size/2)
        .attr("x", 0)
        .text(d => d.text)
        .style("text-anchor", "right");

      // label.append("text")
      // .attr("transform", "translate(50,10)")
      // .attr("x", (d, i) => i * size + size/2)
      // .text(d => d.text)
      // .style("text-anchor", "middle");

    svg
      .append("g")
      .attr("transform", "translate(45,50)")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("y", (d, i) => i * size + size/2)
      .text(d => d.text);

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
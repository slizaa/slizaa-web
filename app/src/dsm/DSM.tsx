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

interface InternalNode {
  id: string;
  x: number;
  y: number;
  weight: number;
}

// tslint:disable-next-line:interface-name
interface Props {
  dependencies: IDependency[];
  nodes: INode[];
  width: number;
  height: number;
}

export default class DSM extends React.Component<Props> {
  private svgRef?: SVGElement | null;

  public componentDidMount() {
    this.createAdjacencyMatrix(this.props.nodes, this.props.dependencies);
  }

  public componentWillReceiveProps(nextProps: Props) {
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

    svg
      .append("g")
      .attr("transform", "translate(50,45)")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("x", (d, i) => i * size + size/2)
      .text(d => d.text)
      .style("text-anchor", "middle");

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
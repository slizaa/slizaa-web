import { select } from 'd3-selection';
import * as React from 'react';

// tslint:disable-next-line:interface-name
interface Props {
  data: number[];
  width: number;
  height: number;
}

export default class BarChart extends React.Component<Props> {
  private svgRef?: SVGElement | null;

  public componentDidMount() {
    this.drawChart(this.props.data);
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.data !== this.props.data) {
      this.drawChart(nextProps.data);
    }
  }

  public render() {
    const { width, height } = this.props;

    return (
      <svg width={width} height={height} ref={ref => (this.svgRef = ref)} />
    );
  }

  private drawChart(data: number[]) {
    const svg = select(this.svgRef!);

    svg.append("g").selectAll("text").data(this.props.data).enter()
    .append("text").text((d,i)=>`${i+1}: ${d}`)
      .attr("x",(d,i)=>(100+i*50)).attr("dx",-10)
      .attr("y",90).attr("dy",(d,i)=>-d);
   svg.append("g").selectAll("circle").data(this.props.data).enter()
    .append("circle")
      .attr("cx",(d,i)=>(100+i*50))
      .attr("cy",100)
      .attr("r",(d,i)=>(d));
  
  }
}
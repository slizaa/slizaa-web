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
    // tslint:disable-next-line:no-console
    console.log(svg);
  }
}
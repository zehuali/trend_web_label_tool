import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import Popup from "./popupBox";
import styled from "styled-components";

const Button = styled.button`
  color: white;
  background: blue;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid blue;
  border-radius: 3px;
`;

class LineChart extends Component {
  state = {
    top: 0,
    left: 0,
    xAxis: 0,
    yAxis: 0,
    labels: [],
    showTooltip: false,
    data: [],
    labels: []
  };

  componentDidMount() {
    fetch("http://zehuali.com/data")
      .then(res => res.json())
      .then(
        result => {
          console.log(result);
          this.setState({
            isLoaded: true,
            labels: result.label,
            data: result.data
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  getText(text) {
    console.log(text);
  }

  render() {
    let chartOptions = {
      events: ["click"],
      tooltips: {
        enabled: true,
        // mode: "x",
        custom: tooltipModel => {
          // hide the tooltip
          if (tooltipModel.opacity === 0) {
            console.log("hide");
            this.state.showTooltip = false;
            return;
          } else {
            this.state.showTooltip = true;
          }
          console.log(tooltipModel);

          const position = this.refs.chart.chartInstance.canvas.getBoundingClientRect();
          // set position of tooltip
          this.setState({
            xAxis: Number(tooltipModel.dataPoints[0].xLabel),
            yAxis: tooltipModel.dataPoints[0].yLabel,
            top: position.top + tooltipModel.caretY,
            left: position.left + tooltipModel.caretX
          });
          // this.setPositionAndData({ top, left, date, value });
        }
      }
    };
    let data = {
      labels: this.state.labels,
      datasets: [
        {
          label: "My First dataset",
          fill: false,
          lineTension: 0.5,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 5,
          pointRadius: 1,
          pointHitRadius: 20,
          data: this.state.data
        }
      ]
    };
    console.log(this.state.xAxis);
    console.log(this.state.yAxis);
    return (
      <div>
        <h1>Hello Line Chart!</h1>
        <Button>Submit</Button>
        <Line data={data} options={chartOptions} ref="chart" />
        {this.state.showTooltip ? (
          <Popup
            top={this.state.top}
            left={this.state.left}
            getText={this.getText}
          />
        ) : null}
      </div>
    );
  }
}

export default LineChart;

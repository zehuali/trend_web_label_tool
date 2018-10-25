import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import Popup from "./popupBox";
import styled from "styled-components";
import localdata from "../data/data";
import colors from "../data/color";
import ReviewBox from "./reviewBox";
import * as zoom from "chartjs-plugin-zoom";

const Button = styled.button`
  color: white;
  background: DarkTurquoise;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid DarkTurquoise;
  border-radius: 3px;
`;

const Main = styled.div`
  margin-left: 160px;
`;

const Item = styled.div`
  font-size: 1em;
  text-align: center;
  color: white;
  padding: 6px 8px 6px 16px;
  text-decoration: none;
  display: block;
  :hover {
    color: white;
    background: gray;
  }
  :active {
    color: #d0cfcf;
    background: gray;
  }
`;

const SideNav = styled.div`
  height: 100%;
  width: 160px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #3f3f3f;
  overflow-x: hidden;
  padding-top: 20px;
`;

const Point = styled.button`
  top: ${prop => prop.posi.top};
  left: ${prop => prop.posi.left};
  background-color: red;
  position: absolute;
  padding: 7px;
  border-radius: 50%;
`;

class LineChart extends Component {
  state = {
    top: 0,
    left: 0,
    xAxis: 0,
    yAxis: 0,
    labels: [],
    showTooltip: false,
    showReviewBox: false,
    data: [],
    labels: [],
    answer: [],
    studentAnswer: "",
    answersList: [],
    comments: [],
    lineChart: null,
    datasets: [],
    setindex: 0,
    role: "Student"
  };

  constructor(props) {
    super(props);

    this.handelSubmit = this.handelSubmit.bind(this);
    this.handelSidenavClick = this.handelSidenavClick.bind(this);
    this.getText = this.getText.bind(this);
    this.getComment = this.getComment.bind(this);
    this.handelZoom = this.handelZoom.bind(this);
  }

  componentDidMount() {
    fetch("http://zehuali.com:3001/data")
      .then(res => res.json())
      .then(
        result => {
          console.log(result);
          let datasets = result.map((x, index) => {
            return x.data.map(xx => {
              return xx + index * 300;
            });
          });
          console.log(datasets);
          this.setState({
            // isLoaded: true,
            labels: result[1].label,
            data: result[1].data,
            datasets: datasets
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            // isLoaded: true,
            data: localdata.data,
            labels: localdata.label,
            error
          });
        }
      );
    fetch("http://zehuali.com:3001/data/answer")
      .then(res => res.json())
      .then(
        result => {
          console.log(result);
          this.setState({
            answersList: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          console.log(error);
        }
      );
  }

  getText(text) {
    this.state.answer.push({
      x: this.state.xAxis,
      y: this.state.yAxis,
      answer: text,
      dataset: this.state.setindex
    });
    this.forceUpdate();
    console.log("aa,", this);
  }

  getComment(comment, result) {
    let review = {
      x: this.state.xAxis,
      y: this.state.yAxis,
      result: result,
      comment: comment,
      dataset: this.state.setindex
    };

    console.log("review", review);
    fetch("http://zehuali.com:3001/data/grade", {
      method: "POST",
      headers: {
        "cache-control": "no-cache",
        "Content-Type": "application/json"
      },
      body: JSON.stringify([review])
    });
    this.state.comments.push(review);
  }

  handelSubmit = () => {
    fetch("http://zehuali.com:3001/data/answer", {
      method: "POST",
      headers: {
        "cache-control": "no-cache",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.answer)
    });
    console.log(this.state.answer);
  };

  handelZoom = () => {
    this.setState({
      showTooltip: false,
      showReviewBox: false
    });
    this.forceUpdate();
  };

  handelReset = () => {
    this.setState({
      answer: []
    });
  };

  handelStudent = () => {
    this.setState({
      role: "Student"
    });
  };

  handelTeacher = () => {
    this.setState({
      role: "Teacher"
    });
  };

  getAnswerPoints = answers => {
    let answerPoints = [];
    console.log(this.state.answersList);
    if (this.refs.chart != null && this.refs.chart.chartInstance != null) {
      answers.forEach(value => {
        const meta = this.refs.chart.chartInstance.getDatasetMeta(
          value.dataset
        );
        const position = this.refs.chart.chartInstance.canvas.getBoundingClientRect();
        let x = meta.data[value.x]._model.x;
        let y = meta.data[value.x]._model.y;

        let answer = {
          x: value.x,
          y: value.y,
          dataset: value.dataset,
          top: position.top + y - 10,
          left: position.left + x - 10,
          answer: value.answer
        };
        console.log("aaaa", answer);
        answerPoints.push(answer);
        // return answer;
      });
    }
    return answerPoints;
  };

  handelSidenavClick = value => {
    this.state.showReviewBox = true;
    this.state.showTooltip = false;
    console.log("event", value);
    console.log(this);
    const meta = this.refs.chart.chartInstance.getDatasetMeta(value.dataset);
    const position = this.refs.chart.chartInstance.canvas.getBoundingClientRect();
    let x = meta.data[value.x]._model.x;
    let y = meta.data[value.x]._model.y;
    console.log(x + "px");

    this.setState({
      xAxis: value.x,
      yAxis: value.y,
      top: position.top + y,
      left: position.left + x,
      studentAnswer: value.answer
    });
  };

  render() {
    let chartData = {
      labels: this.state.labels,
      datasets: this.state.datasets.map((data, index) => {
        return {
          label: "Dataset " + (index + 1),
          fill: false,
          lineTension: 0,
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length],
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: colors[index % colors.length],
          pointBackgroundColor: "#fff",
          pointBorderWidth: 0,
          pointRadius: 1,
          pointHitRadius: 10,
          data: data
        };
      })
    };

    let charopt = {
      responsive: true,
      animation: false,
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false
            },
            ticks: {
              display: true
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              display: false
            },
            ticks: {
              display: false
            }
          }
        ]
      },
      // Container for pan options
      pan: {
        // Boolean to enable panning
        enabled: false,

        // Panning directions. Remove the appropriate direction to disable
        // Eg. 'y' would only allow panning in the y direction
        mode: "xy"
        // Function called once panning is completed
        // Useful for dynamic data loading
      },

      // Container for zoom options
      zoom: {
        // Boolean to enable zooming
        enabled: true,
        sensitivity: 0.1,
        drag: false,

        // Zooming directions. Remove the appropriate direction to disable
        // Eg. 'y' would only allow zooming in the y direction
        mode: "x",
        limits: {
          max: 100,
          min: 50
        },

        onZoom: this.handelZoom
      },
      events: ["click"],
      tooltips: {
        enabled: false,
        // mode: "x",
        custom: tooltipModel => {
          // hide the tooltip
          if (tooltipModel.opacity === 0) {
            console.log("hide");
            this.setState({
              showTooltip: false,
              showReviewBox: false
            });
            return;
          } else {
            this.state.showTooltip = true;
            this.state.showReviewBox = false;
          }
          console.log(tooltipModel);
          let idx = tooltipModel.dataPoints[0].datasetIndex;
          const position = this.refs.chart.chartInstance.canvas.getBoundingClientRect();
          // set position of tooltip
          this.setState({
            xAxis: Number(tooltipModel.dataPoints[0].xLabel),
            yAxis: tooltipModel.dataPoints[0].yLabel,
            top: position.top + tooltipModel.caretY,
            left: position.left + tooltipModel.caretX,
            setindex: idx
          });
          // console.log(position.left + tooltipModel.caretX);
        }
      }
    };

    this.state.lineChart = (
      <Line data={chartData} options={charopt} ref="chart" />
    );
    // answer points for teacher.
    let answerPoints = this.getAnswerPoints(this.state.answersList);
    let studentAnswerPoints = this.getAnswerPoints(this.state.answer);

    return (
      <div>
        <SideNav>
          {this.state.role.toLowerCase() === "teacher"
            ? this.state.answersList.map((value, index, array) => (
                <Item
                  value={value}
                  onClick={() => this.handelSidenavClick(value)}
                >
                  Answer: {value.answer}
                </Item>
              ))
            : null}
          <hr />
          {this.state.role.toLowerCase() === "student"
            ? this.state.answer.map((value, index, array) => (
                <Item
                  value={value}
                  onClick={() => this.handelSidenavClick(value)}
                >
                  Answer: {value.answer}
                </Item>
              ))
            : null}
          <br />
          <br />
          <br />
          <br />
        </SideNav>
        <Main id="main">
          <h1>Line Chart Demo</h1>
          <h3>Current Role: {this.state.role}</h3>
          <Button onClick={this.handelStudent}>Student</Button>
          <Button onClick={this.handelTeacher}>Teacher</Button>
          {this.state.lineChart}

          {this.state.showTooltip ? (
            <Popup
              top={this.state.top}
              left={this.state.left}
              getText={this.getText}
            />
          ) : null}

          {this.state.showReviewBox ? (
            <ReviewBox
              top={this.state.top}
              left={this.state.left}
              answer={this.state.studentAnswer}
              getComment={this.getComment}
            />
          ) : null}
          {this.state.role.toLowerCase() === "teacher"
            ? answerPoints.map(value => (
                <Point
                  posi={{ top: value.top + "px", left: value.left + "px" }}
                  value={value}
                  onClick={() => this.handelSidenavClick(value)}
                />
              ))
            : null}
          {this.state.role.toLowerCase() === "student"
            ? studentAnswerPoints.map(value => (
                <Point
                  posi={{ top: value.top + "px", left: value.left + "px" }}
                  value={value}
                  onClick={() => this.handelSidenavClick(value)}
                />
              ))
            : null}
          <Button onClick={this.handelSubmit}>Submit</Button>
          <Button onClick={this.handelReset}>Reset</Button>
        </Main>
      </div>
    );
  }
}

export default LineChart;

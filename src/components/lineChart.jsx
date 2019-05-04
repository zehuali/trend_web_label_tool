import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import Popup from "./popupBox";
import styled from "styled-components";
import localdata from "../data/data";
import colors from "../data/color";
import ReviewBox from "./reviewBox";
import CommentBox from "./commentBox";
import ExampleBox from "./exampleBox";
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
  margin: 0em 0em 1em 0em;
`;

const Point = styled.button`
  top: ${prop => prop.posi.top};
  left: ${prop => prop.posi.left};
  background-color: ${prop => prop.bcolor};
  position: absolute;
  padding: 7px;
  border-radius: 50%;
`;
const PointNote = styled.button`
  background-color: ${prop => prop.bcolor};
  position: relative;
  padding: 7px;
  border-radius: 50%;
`;
const Footer = styled.div`
  position: relative;
  text-align: left;
  padding: 0em 0em 1em 2em;
`;

class LineChart extends Component {
  state = {
    top: 0,
    left: 0,
    xAxis: 0,
    yAxis: 0,
    labels: [],
    start: false,
    server: "http://localhost:3001/",
    show: {
      showTooltip: false,
      showReviewBox: false,
      showEditTooltip: false,
      showCommentBox: false,
      showExampleBox: false
    },
    data: [],
    labels: [],
    gradesList: [],
    studentAnswer: "",
    answersList: [],
    comment: "",
    result: "",
    lineChart: null,
    datasets: [],
    setindex: 0,
    role: "Student"
  };

  constructor(props) {
    super(props);

    this.getText = this.getText.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.getComment = this.getComment.bind(this);
    this.handelZoom = this.handelZoom.bind(this);
  }

  componentDidMount() {
    const server = this.state.server;
    fetch(server + "data")
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
            labels: result[0].label,
            data: result[0].data,
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
    fetch(server + "data/answer")
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
    fetch(server + "data/grade")
      .then(res => res.json())
      .then(
        result => {
          console.log(result);
          this.setState({
            gradesList: result
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
    // for (let i = 0; i < this.state.answer.length; i++) {
    //   if (
    //     this.state.answer[i].x == this.state.xAxis &&
    //     this.state.answer[i].y == this.state.yAxis
    //   ) {
    //     this.state.answer[i].answer = text;
    //     this.forceUpdate();
    //     return;
    //   }
    // }
    const server = this.state.server;
    let toUpload = {
      x: this.state.xAxis,
      y: this.state.yAxis,
      answer: text,
      dataset: this.state.setindex,
      role: this.state.role
    };
    console.log("aa,", this);
    fetch(server + "data/answer", {
      method: "POST",
      headers: {
        "cache-control": "no-cache",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(toUpload)
    });

    this.state.answersList.push(toUpload);
    this.forceUpdate();
  }
  closePopup() {
    this.setAllFalse();
    this.forceUpdate();
  }

  getComment(comment, result) {
    const server = this.state.server;
    let review = {
      x: this.state.xAxis,
      y: this.state.yAxis,
      answer: this.state.studentAnswer,
      result: result,
      comment: comment,
      dataset: this.state.setindex
    };

    console.log("review", review);
    fetch(server + "data/grade", {
      method: "POST",
      headers: {
        "cache-control": "no-cache",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(review)
    });
    this.state.gradesList.push(review);
  }

  setAllFalse = () => {
    this.state.show.showTooltip = false;
    this.state.show.showReviewBox = false;
    this.state.show.showEditTooltip = false;
    this.state.show.showCommentBox = false;
    this.state.show.showExampleBox = false;
  };

  handelZoom = () => {
    this.setAllFalse();
    this.forceUpdate();
    this.forceUpdate();
  };

  handelStudent = () => {
    this.setAllFalse();
    this.setState({
      role: "Student",
      start: true
    });
  };

  handelTeacher = () => {
    this.setAllFalse();
    this.setState({
      role: "Teacher",
      start: true
    });
  };

  getAnswerPoints = (answers, color) => {
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
          answer: value.answer,
          comment: value.comment,
          result: value.result,
          role: value.role
        };
        answerPoints.push(answer);
        // return answer;
      });
    }
    return answerPoints;
  };

  handelDotClick = (value, role) => {
    this.setAllFalse();
    if (role.toLowerCase() === "student") {
      if (value.result) {
        this.state.show.showCommentBox = true;
      } else if (value.role.toLowerCase() == "teacher") {
        this.state.show.showExampleBox = true;
      } else {
        this.state.show.showEditTooltip = true;
      }
    } else {
      if (value.role && value.role.toLowerCase() == "teacher") {
        this.state.show.showExampleBox = true;
      } else {
        this.state.show.showReviewBox = true;
      }
    }
    const meta = this.refs.chart.chartInstance.getDatasetMeta(value.dataset);
    const position = this.refs.chart.chartInstance.canvas.getBoundingClientRect();
    let x = meta.data[value.x]._model.x;
    let y = meta.data[value.x]._model.y;
    console.log("111", value);
    this.setState({
      xAxis: value.x,
      yAxis: value.y,
      top: position.top + y,
      left: position.left + x,
      studentAnswer: value.answer,
      setindex: value.dataset,
      comment: value.comment,
      result: value.result
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
      maintainAspectRatio: false,
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
            this.setAllFalse();
            return;
          } else {
            this.setState({
              show: {
                showTooltip: true,
                showReviewBox: false,
                showEditTooltip: false,
                showCommentBox: false,
                showExampleBox: false
              }
            });
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
    let answerPoints = [];
    let gradePoints = [];
    if (this.state.start) {
      answerPoints = this.getAnswerPoints(this.state.answersList, "green");
      gradePoints = this.getAnswerPoints(this.state.gradesList, "red");
    }

    return (
      <div>
        <Main id="main">
          <h1>Line Chart Demo</h1>
          <h3>Current Role: {this.state.role}</h3>
          <Button onClick={this.handelStudent}>Student</Button>
          <Button onClick={this.handelTeacher}>Teacher</Button>
          {this.state.lineChart}

          {this.state.start
            ? answerPoints.map(value =>
                value.role.toLowerCase() == "student" ? (
                  <Point
                    bcolor="red"
                    posi={{ top: value.top + "px", left: value.left + "px" }}
                    value={value}
                    onClick={() => this.handelDotClick(value, this.state.role)}
                  />
                ) : (
                  <Point
                    bcolor="yellow"
                    posi={{ top: value.top + "px", left: value.left + "px" }}
                    value={value}
                    onClick={() => this.handelDotClick(value, this.state.role)}
                  />
                )
              )
            : null}
          {this.state.start
            ? gradePoints.map(value => (
                <Point
                  bcolor="green"
                  posi={{ top: value.top + "px", left: value.left + "px" }}
                  value={value}
                  onClick={() => this.handelDotClick(value, this.state.role)}
                />
              ))
            : null}

          {this.state.show.showTooltip ? (
            <Popup
              top={this.state.top}
              left={this.state.left}
              getText={this.getText}
              close={this.closePopup}
            />
          ) : null}
          {this.state.show.showEditTooltip ? (
            <Popup
              top={this.state.top}
              left={this.state.left}
              value={this.state.studentAnswer}
              getText={this.getText}
              close={this.closePopup}
            />
          ) : null}

          {this.state.show.showReviewBox ? (
            <ReviewBox
              top={this.state.top}
              left={this.state.left}
              answer={this.state.studentAnswer}
              getComment={this.getComment}
              close={this.closePopup}
            />
          ) : null}

          {this.state.show.showExampleBox ? (
            <ExampleBox
              top={this.state.top}
              left={this.state.left}
              answer={this.state.studentAnswer}
              close={this.closePopup}
            />
          ) : null}

          {this.state.show.showCommentBox ? (
            <CommentBox
              top={this.state.top}
              left={this.state.left}
              answer={this.state.studentAnswer}
              getComment={this.getComment}
              comment={this.state.comment}
              result={this.state.result}
              close={this.closePopup}
            />
          ) : null}
        </Main>
        <Footer>
          <p>
            <PointNote bcolor="red" />
            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Waiting for grade
          </p>
          <p>
            <PointNote bcolor="green" />
            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Teacher's grade and comments
          </p>
          <p>
            <PointNote bcolor="yellow" />
            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Teacher's example
          </p>
        </Footer>
      </div>
    );
  }
}

export default LineChart;

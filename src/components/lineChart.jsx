import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import Popup from "./popupBox";
import styled from "styled-components";
import localdata from "../data/data";
import colors from "../data/color";
import ReviewBox from "./reviewBox";
import CommentBox from "./commentBox";
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

const GreenPoint = styled(Point)`
  background-color: green;
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
    showEditTooltip: false,
    showCommentBox: false,
    data: [],
    labels: [],
    gradesList: [],
    studentAnswer: "",
    answersList: [],
    comments: [],
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
    fetch("http://zehuali.com:3001/data/grade")
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
    let toUpload = {
      x: this.state.xAxis,
      y: this.state.yAxis,
      answer: text,
      dataset: this.state.setindex,
      role: this.state.role
    };
    console.log("aa,", this);
    fetch("http://zehuali.com:3001/data/answer", {
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

  getComment(comment, result) {
    let review = {
      x: this.state.xAxis,
      y: this.state.yAxis,
      answer: this.state.studentAnswer,
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
      body: JSON.stringify(review)
    });
    this.state.comments.push(review);
  }

  handelZoom = () => {
    this.setState({
      showTooltip: false,
      showReviewBox: false,
      showEditTooltip: false,
      showCommentBox: false
    });
    this.forceUpdate();
  };

  handelStudent = () => {
    this.setState({
      role: "Student",
      showTooltip: false,
      showReviewBox: false,
      showEditTooltip: false,
      showCommentBox: false
    });
  };

  handelTeacher = () => {
    this.setState({
      role: "Teacher",
      showTooltip: false,
      showReviewBox: false,
      showEditTooltip: false,
      showCommentBox: false
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
    if (role.toLowerCase() === "student") {
      if (value.result) {
        this.state.showEditTooltip = false;
        this.state.showReviewBox = false;
        this.state.showTooltip = false;
        this.state.showCommentBox = true;
      } else {
        this.state.showEditTooltip = true;
        this.state.showReviewBox = false;
        this.state.showTooltip = false;
        this.state.showCommentBox = false;
      }
    } else {
      this.state.showEditTooltip = false;
      this.state.showReviewBox = true;
      this.state.showTooltip = false;
      this.state.showCommentBox = false;
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
              showReviewBox: false,
              showEditTooltip: false,
              showCommentBox: false
            });
            return;
          } else {
            this.setState({
              showTooltip: true,
              showReviewBox: false,
              showEditTooltip: false,
              showCommentBox: false
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
    let answerPoints = this.getAnswerPoints(this.state.answersList, "green");
    let gradePoints = this.getAnswerPoints(this.state.gradesList, "red");

    return (
      <div>
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
          {this.state.showEditTooltip ? (
            <Popup
              top={this.state.top}
              left={this.state.left}
              value={this.state.studentAnswer}
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
          {answerPoints.map(
            value =>
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
          )}
          {gradePoints.map(value => (
            <Point
              bcolor="green"
              posi={{ top: value.top + "px", left: value.left + "px" }}
              value={value}
              onClick={() => this.handelDotClick(value, this.state.role)}
            />
          ))}
          {this.state.showCommentBox ? (
            <CommentBox
              top={this.state.top}
              left={this.state.left}
              answer={this.state.studentAnswer}
              getComment={this.getComment}
              comment={this.state.comment}
              result={this.state.result}
            />
          ) : null}
        </Main>
      </div>
    );
  }
}

export default LineChart;

import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import LineChart from "./components/lineChart";
import AnswerList from "./components/answerList";

class App extends Component {
  render() {
    return (
      <div className="App">
        <AnswerList />
        <LineChart />
      </div>
    );
  }
}

export default App;

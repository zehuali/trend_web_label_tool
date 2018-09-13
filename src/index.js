import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import LineChart from "./components/lineChart";

ReactDOM.render(<LineChart />, document.getElementById("root"));
registerServiceWorker();

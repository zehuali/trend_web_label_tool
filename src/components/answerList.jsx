import React, { Component } from "react";
import styled from "styled-components";

const Item = styled.div`
  font-size: 1em;
  text-align: center;
  color: palevioletred;
  padding: 6px 8px 6px 16px;
  text-decoration: none;
  display: block;
  :hover {
    color: white;
    background: gray;
  }
  :active {
    color: red;
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
  background-color: #111;
  overflow-x: hidden;
  padding-top: 20px;
`;

class answerList extends Component {
  state = { data: [] };
  constructor(props) {
    super(props);
    this.state = { data: [] };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch("http://zehuali.com/data/answer")
      .then(res => res.json())
      .then(
        result => {
          console.log(result);
          this.setState({
            data: result
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

  handelSubmit = () => {
    this.props.getText(this.state.value);
  };
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  render() {
    console.log(this.state.data);
    // console.log(this.state.data[0]["x"]);
    return (
      <SideNav>
        {this.state.data.map((value, index, array) => (
          <Item>
            X: {value.x}, Y: {value.y}
          </Item>
        ))}
      </SideNav>
    );
  }
}

export default answerList;

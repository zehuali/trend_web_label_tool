import React, { Component } from "react";
import styled from "styled-components";

const Title = styled.h2`
  font-size: 1em;
  text-align: center;
  color: palevioletred;
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
  constructor(props) {
    super(props);
    this.state = { value: "" };

    this.handleChange = this.handleChange.bind(this);
  }

  handelSubmit = () => {
    this.props.getText(this.state.value);
  };
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  render() {
    return (
      <SideNav>
        <Title>Label it:</Title>
        <Title>Label it:</Title>
        <Title>Label it:</Title>
      </SideNav>
    );
  }
}

export default answerList;

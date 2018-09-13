import React, { Component } from "react";
import styled from "styled-components";

const Title = styled.h2`
  font-size: 1em;
  text-align: center;
  color: palevioletred;
`;

const Container = styled.div`
  top: ${prop => prop.posi.top};
  left: ${prop => prop.posi.left};
  background-color: papayawhip;
  position: absolute;
`;

class Popup extends Component {
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
      <Container
        posi={{ top: this.props.top + "px", left: this.props.left + "px" }}
      >
        <Title>Label it:</Title>
        <input value={this.state.value} onChange={this.handleChange} />
        <button onClick={this.handelSubmit}>save</button>
      </Container>
    );
  }
}

export default Popup;

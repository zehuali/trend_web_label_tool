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
  background-color: DarkSeaGreen;
  position: absolute;
  opacity: 0.8;
`;

class ReviewBox extends Component {
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
    console.log(this.props);
    return (
      <Container
        posi={{ top: this.props.top + "px", left: this.props.left + "px" }}
      >
        <Title>Student Answer:</Title>
        <p>{this.props.answer}</p>

        <input value={this.state.value} onChange={this.handleChange} />
        <button onClick={this.handelSubmit}>save</button>
      </Container>
    );
  }
}

export default ReviewBox;

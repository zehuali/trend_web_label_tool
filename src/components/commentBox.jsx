import React, { Component } from "react";
import styled from "styled-components";

const Title = styled.h2`
  font-size: 1.5em;
  text-align: left;
  color: DimGrey;
`;

const Text = styled.h3`
  font-size: 1.25em;
  text-align: center;
  color: black;
`;

const Container = styled.div`
  top: ${prop => prop.posi.top};
  left: ${prop => prop.posi.left};
  background-color: AliceBlue;
  position: absolute;
  opacity: 0.98;
  border-radius: 5px;
  padding: 0px 10px;
`;

const Mark = styled.span`
  color: red;
`;

class CommnetBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    return (
      <Container
        posi={{ top: this.props.top + "px", left: this.props.left + "px" }}
      >
        <Title>Your Answer:</Title>
        <Text>
          {this.props.answer} <Mark>{this.props.result}</Mark>
        </Text>
        <Title>Comment:</Title>
        <Text>{this.props.comment}</Text>
      </Container>
    );
  }
}

export default CommnetBox;

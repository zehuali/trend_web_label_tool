import React, { Component } from "react";
import styled from "styled-components";

const Title = styled.h2`
  font-size: 1.5em;
  text-align: left;
  color: DimGrey;
`;

const Flex = styled.div`
  display: flex;
  position: relative;
`;

const Close = styled.input`
  position: absolute;
  right: 0;
  margin: 10px 0px;
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

class ExampleBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    return (
      <Container
        posi={{ top: this.props.top + "px", left: this.props.left + "px" }}
      >
        <Flex>
          <Title>Example:&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</Title>
          <Close type="image" src="close.png" onClick={this.props.close} />
        </Flex>

        <Text>{this.props.answer}</Text>
      </Container>
    );
  }
}

export default ExampleBox;

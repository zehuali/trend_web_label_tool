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

const Container = styled.div`
  top: ${prop => prop.posi.top};
  left: ${prop => prop.posi.left};
  background-color: GhostWhite;
  position: absolute;
  opacity: 0.98;
  border-radius: 5px;
  padding: 0px 10px;
`;

const Save = styled.button`
  font-size: 1em;
  margin: 0 0.25em;
  padding: 0.25em 1em;
  background-color: #e7e7e7;
  color: black;
  border-radius: 4px;
`;

const InputBox = styled.input`
  background: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  margin: 0 0.25em;
  outline: 0;
  padding: 7px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  background-color: #e8eeef;
  -webkit-box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03) inset;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03) inset;
  margin-bottom: 30px;
  :focus {
    background: #d2d9dd;
  }
`;

class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      top: 0,
      left: 0
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handelSubmit = () => {
    this.props.getText(this.state.value);
  };
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  render() {
    console.log("props", this.props);
    if (
      this.props.top != this.state.top ||
      this.props.left != this.state.left
    ) {
      this.state.value = this.props.value ? this.props.value : "";
      this.state.top = this.props.top;
      this.state.left = this.props.left;
    }

    return (
      <Container
        posi={{ top: this.props.top + "px", left: this.props.left + "px" }}
      >
        <Flex>
          <Title>Label it:&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</Title>
          <Close type="image" src="close.png" onClick={this.props.close} />
        </Flex>

        <InputBox value={this.state.value} onChange={this.handleChange} />
        <Save onClick={this.handelSubmit}>save</Save>
      </Container>
    );
  }
}

export default Popup;

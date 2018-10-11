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

const Button = styled.button`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  font-size: 2em;
  margin: 0.25em 1em;
`;
const Save = styled.button`
  font-size: 1em;
  margin: 0 0.25em;
  padding: 0.25em 1em;
  background-color: #e7e7e7;
  color: black;
  border-radius: 4px;
`;

const RightButton = styled(Button)`
  background-color: ${props => (props.active ? "Chartreuse" : "DarkGreen")};
`;

const WrongButton = styled(Button)`
  background-color: ${props => (props.active ? "OrangeRed" : "DarkRed")};
`;

const InputBox = styled.input`
  background: rgba(255, 255, 255, 0.1);
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

class ReviewBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      rightActive: false,
      wrongActive: false,
      top: 0,
      left: 0
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handelSubmit = () => {
    this.props.getText(this.state.value);
  };
  clickRight = () => {
    this.setState({
      rightActive: true,
      wrongActive: false
    });
  };
  clickWrong = () => {
    this.setState({
      rightActive: false,
      wrongActive: true
    });
  };
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  render() {
    if (
      this.props.top != this.state.top ||
      this.props.left != this.state.left
    ) {
      this.state.value = "";
      this.state.rightActive = false;
      this.state.wrongActive = false;
      this.state.top = this.props.top;
      this.state.left = this.props.left;
    }
    console.log(this.props);
    return (
      <Container
        posi={{ top: this.props.top + "px", left: this.props.left + "px" }}
      >
        <Title>Student Answer:</Title>
        <Text>{this.props.answer}</Text>
        <RightButton active={this.state.rightActive} onClick={this.clickRight}>
          &#10004;
        </RightButton>
        <WrongButton active={this.state.wrongActive} onClick={this.clickWrong}>
          &#10006;
        </WrongButton>
        <br />

        <InputBox value={this.state.value} onChange={this.handleChange} />
        <Save onClick={this.handelSubmit}>Save</Save>
      </Container>
    );
  }
}

export default ReviewBox;

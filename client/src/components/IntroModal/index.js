import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import styled from 'styled-components';

// TODO: Replece current user defenition from app component
// Get state from redux store
const mapStateToProps = (state) => {
  const props = {
    users: state.users,
    currentUser: state.currentUser,
  };

  return props;
};

// Create redux actions
const actionCreators = {
  setCurrentUsers: actions.setCurrentUser,
};

const IntroModal = (props) => {
  // Unzip props
  const { createNewUser, users } = props;

  const [name, setName] = useState('');
  const [UIState, setUIState] = useState({
    currentInputState: 'normal',
  });

  const handleInput = (e) => {
    e.preventDefault();

    if (UIState.currentInputState === 'error') {
      // return default normal state
      setUIState({ currentInputState: 'normal' });
    }

    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name.length === 0) {
      // name can't be empty
      setUIState({ currentInputState: 'error' });
      return;
    }

    createNewUser(name);

    setName(''); // reset input value (i)
  };

  return (
    <ModalWrapper>
      <Modal>
        <Form onSubmit={handleSubmit}>
          <Label htmlFor="username">What's your name</Label>
          <Input
            currentInputState={UIState.currentInputState}
            id="username"
            name="username"
            type="text"
            onChange={handleInput}
            value={name} />
          <Button>Let's chat</Button>
        </Form>
      </Modal>
    </ModalWrapper>
  );
};

// Styles START
const Modal = styled.div`
  box-sizing: unset;
  width: 60vmin;
  height: 25vmin;
  margin: auto;
  
  padding: 3em 2em;
  display: flex;

  background: #fff;
`

const ModalWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;

  display: flex;

  background: rgba(0, 0, 0, .5);
`

const Form = styled.form`
  box-sizing: unset;
  width: 100%;
  height: 100%;
  margin: auto;

  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
`

const Label = styled.label`
  font-size: 1.5em;
  font-weight: 700;
  color: #39393a;
`

const inputCSSState = {
  normal: '#ccc',
  error: 'tomato',
}
const Input = styled.input`
  box-sizing: unset;
  margin-top: auto;
  margin-bottom: 2em;

  padding: .6em;
  border: 1px solid ${(props) => inputCSSState[props.currentInputState]};
  outline: none;
  color: #39393a;
`
const Button = styled.button`
  box-sizing: unset;
  padding: .6em 0;
  font-weight: 600;
  color: #fff;
  background: royalblue;
  border: 1px solid royalblue;
  outline: none;
  cursor: pointer;
  transition: all .2s;

  :hover {
    background: #0541d4;
    border: 1px solid #0541d4;
  }
`

export default connect(mapStateToProps, actionCreators)(IntroModal);

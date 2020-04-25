import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import events from '../../events';

const IntroModal = ({ createNewUser, rememberCurrentUser, socket }) => {
  useEffect(() => {
    socket.on(events.ADD_USER_FROM_SERVER, rememberCurrentUser);

    return () => { // unsubscribe
      socket.off(events.ADD_USER_FROM_SERVER, rememberCurrentUser);
    }
  })

  const [name, setName] = useState('');

  const handleInput = (e) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createNewUser(name);
    setName(''); // reset input value (i)
  };

  return (
    <ModalWrapper>
      <Modal>
        <Form onSubmit={handleSubmit}>
          <Label htmlFor="username">What's your name</Label>
          <Input
            required
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
  color: #333;
`

const Input = styled.input`
  border: 1px solid #ccc;
  margin-top: auto;
  margin-bottom: 2em;

  padding: .6em;
  color: #333;
`
const Button = styled.button`
  padding: .6em 0;
  font-weight: 600;
  color: #333;
  background: transparent;
  border: 1px solid #333;
  cursor: pointer;
`



export default IntroModal;

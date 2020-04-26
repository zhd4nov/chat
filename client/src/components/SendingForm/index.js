import React, { useState } from 'react';
import styled from 'styled-components';

const SendingForm = (props) => {
  const [message, setMessage] = useState('');

  const handleInput = (e) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  return (
    <Form>
      <Message
        placeholder="Write a massage..."
        onChange={handleInput}
        value={message} />
      <SendButton>Send</SendButton>
    </Form>
  )
};

const Form = styled.form`
  width: 100%;
  height: 20%;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-top: 1em;

  border-top: 1px solid #bababa;
`

const Message = styled.textarea`
  width: 80%;
  height: 100%;
  resize: none;
  border: none;
  outline: none;
`

const SendButton = styled.button`
  background: transparent;
  border: none;
  outline: none;
  color: royalblue;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;

  :hover {
    color: #0541d4;
  }
`

export default SendingForm;

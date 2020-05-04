import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import events from '../../events';

const mapStateToProps = (state) => {
  const props = {
    currentChat: state.currentChat,
  };

  return props;
};

const SendingForm = (props) => {
  const { socket, currentChat } = props;
  // Move to redux store:
  const [message, setMessage] = useState('');

  const handleInput = (e) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  const handleSendByEnter = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      handleMessageSending(e);
    }
  };

  const handleMessageSending = (e) => {
    e.preventDefault();
    // Send an event to server 
    socket.emit(
      events.ADD_MESSAGE_FROM_CLIENT,
      { newMessage: message, chatId: currentChat },
    );

    setMessage(''); // Reset message text
  }

  return (
    <Form onSubmit={handleMessageSending}>
      <Message
        placeholder="Write a massage..."
        onChange={handleInput}
        onKeyDown={handleSendByEnter}
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

export default connect(mapStateToProps)(SendingForm);

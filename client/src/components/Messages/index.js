import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';

import Message from '../Message';

const mapStateToProps = (state) => {
  const props = {
    messages: state.messages,
    currentChat: state.currentChat,
    currentUser: state.currentUser,
  };

  return props;
};

const Messages = (props) => {
  const { messages, currentChat, currentUser } = props;
  const preparedMessages = messages.allIds.map((msgId) => messages.byIds[msgId]);

  const messagesEnd = useRef(null);

  const scrollToBottom = () => {
    if (!messagesEnd) {
      return;
    }
    messagesEnd.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  });

  return (
    <Container currentChat >
      <Scrollbars
        style={{ height: '480px', width: '100%' }}
        renderView={props => (
          <div {...props} style={{ ...props.style, overflowX: 'hidden', paddingTop: '1em' }} />
        )}>
        {
          preparedMessages
            .filter((message) => message.chatId === currentChat)
            .map((message) => <Message message={message} key={message.id} />)
        }
        <div ref={messagesEnd} />
      </Scrollbars>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 80%;
  max-height: 80%;

  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  padding: .5em 0 2em;
  > div {
    overflow: hidden;
    box-sizing: border-box;
  }
`;

export default connect(mapStateToProps)(Messages);

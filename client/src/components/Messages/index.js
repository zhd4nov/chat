import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';

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
            .map((message) => {
              const {
                authorId,
                authorName,
                id: messageId,
                text,
                time } = message;

              return (
                <Message right={authorId === currentUser.id} key={messageId} >
                  <Author>{authorName}</Author>
                  <Text>{text}</Text>
                  <Timestamp>{time}</Timestamp>
                </Message>
              );
            })
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
`
const messagePosition = {
  right: 'left',
  left: 'right',
}
const Message = styled.div`
  position: relative;
  margin-right:${(props) => props.right
    ? '.8em'
    : '0'};
  margin-${(props) => props.right
    ? messagePosition.right
    : messagePosition.left}: auto;
  text-align: right;
  width: 60%;
  padding: 2em 1em 1em;
  margin-bottom: .5em;
  color: #fff;
  background-color: ${(props) => props.right
    ? 'royalblue'
    : 'gray'};
  border-radius: .2em;
`

const Author = styled.span`
  position: absolute;
  top: .5em;
  left: 1em;

  font-size: .5em;
`

const Text = styled.p`
  width: 100%;
  font-size: .8em;
`
const Timestamp = styled.span`
  position: absolute;
  top: .5em;
  right: 1em;

  font-size: .5em;
`
export default connect(mapStateToProps)(Messages);

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';



const Messages = ({ messages, currentChatId }) => {
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
    <Container currentChatId >
      <Scrollbars
        style={{ height: '480px', width: '100%' }}
        renderView={props => (
          <div {...props} style={{ ...props.style, overflowX: 'hidden', paddingTop: '1em' }} />
        )}>
        {
          messages
            .filter((message) => message.chatId === currentChatId)
            .map((message) => {
              const { authorName, id: messageId, text, time } = message;

              return (
                <Message key={messageId} >
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

const Message = styled.div`
  position: relative;
  width: 60%;
  padding: 2em 1em 1em;
  margin-bottom: .5em;

  background: rgba(0, 0, 0, .1);
  border-radius: .2em;
`

const Author = styled.span`
  position: absolute;
  top: .5em;
  left: 1em;

  font-size: .8em;
`

const Text = styled.p`
  width: 100%;
`
const Timestamp = styled.span`
  position: absolute;
  top: .5em;
  right: 1em;

  font-size: .8em;
  color: #39393a;
`
export default Messages;

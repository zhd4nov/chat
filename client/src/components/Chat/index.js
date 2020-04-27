import React from 'react';
import styled from 'styled-components';

// TODO: Rename chat (in future)
const Chat = ({ chat, currentChatId, handleCurrentChat, handleRemoveChat }) => {
  const { name } = chat;

  const isCurrentChat = () => chat.id === currentChatId;

  // Define component option:
  const activeChat = (
    <CurrentChatContainer>
      <Title active>{name}</Title>
      <CloseCross onClick={handleRemoveChat} >&#10006;</CloseCross>
    </CurrentChatContainer>
  );

  const inactiveChat = (
    <Container onClick={handleCurrentChat(chat.id)}>
      <Title >{name}</Title>
    </Container>
  );
  // render component with the right style
  return isCurrentChat() ? activeChat : inactiveChat;
};

// Style START
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 7vh;

  display: flex;
  background: ${(props) => props.active ? '#' : 'transparent'};
  cursor: pointer;

  ::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);

    width: 80%;
    height: 1px;
    background: #bababa;
  }
`

const CurrentChatContainer = styled(Container)`
  background: #e5e5e5;

  ::after {
    display: none;
  }
`

const Title = styled.p`
  width: fit-content;
  margin: auto;
  color: ${(props) => props.active ? 'royalblue' : '#bababa'};
`

const CloseCross = styled.button`
  position: absolute;
  top: .5em;
  right: .5em;

  border: none;
  outline: none;
  background: transparent;
  font-size: .7em;
  color: #39393a;
  cursor: pointer;
  transition: all .2s;

  :hover {
    color: tomato;
  }
`

export default Chat;

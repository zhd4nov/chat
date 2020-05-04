import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import events from '../../events';
import * as actions from '../../actions';

const mapStateToProps = (state) => {
  const props = {
    currentChat: state.currentChat,
    currentUser: state.currentUser,
  };

  return props;
};

const actionCreators = {
  setCurrentChat: actions.setCurrentChat,
};

// TODO: Rename chat, Invite link right into card
const Chat = (props) => {
  const { chat, currentChat, currentUser, socket } = props;

  const isCurrentChat = () => chat.id === currentChat;

  const handleRemoveChat = (chat) => (e) => {
    e.preventDefault();
    // Only hostUser can do it (!) check...
    if (chat.hostUserID === currentUser.id) {
      socket.emit(events.DELETE_CHAT_FROM_CLIENT, chat.id)
    } else {
      // TODO: set behavior if forbiden
    }
  };

  const handleCurrentChat = (id) => () => {
    const { setCurrentChat } = props;
    setCurrentChat({ chatId: id });
  };

  // Define component option:
  const activeChat = (
    <CurrentChatContainer>
      <Title active>{chat.name}</Title>
      <CloseCross onClick={handleRemoveChat(chat)} >&#10006;</CloseCross>
    </CurrentChatContainer>
  );

  const inactiveChat = (
    <Container onClick={handleCurrentChat(chat.id)}>
      <Title >{chat.name}</Title>
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
  ::after {
    background: royalblue;
  }
`

const Title = styled.p`
  width: fit-content;
  margin: auto;
  color: ${(props) => props.active ? 'royalblue' : '#bababa'};
`

const CloseCross = styled.button`
  position: absolute;
  top: 1em;
  left: 10%;

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

export default connect(mapStateToProps, actionCreators)(Chat);

import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as actions from '../../actions';

import Controlls from './Controlls';

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
  const { chat, currentChat, socket } = props;

  const isCurrentChat = () => chat.id === currentChat;

  const handleCurrentChat = (id) => () => {
    const { setCurrentChat } = props;
    setCurrentChat({ chatId: id });
  };

  // Define component option:
  const activeChat = (
    <CurrentChatContainer>
      <Controlls chat={chat} socket={socket} />
      <Title active>{chat.name}</Title>
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
  height: 10vh;

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
`;

const CurrentChatContainer = styled(Container)`
  ::after {
    background: royalblue;
  }
`;

const Title = styled.p`
  width: fit-content;
  margin: auto;
  color: ${(props) => props.active ? 'royalblue' : '#bababa'};
`;

export default connect(mapStateToProps, actionCreators)(Chat);

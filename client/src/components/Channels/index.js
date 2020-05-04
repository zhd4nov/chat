import React from 'react';
import { connect } from 'react-redux';
import faker from 'faker';
import styled from 'styled-components';

import events from '../../events';

import Chat from '../Chat';

const mapStateToProps = (state) => {
  const props = {
    chats: state.chats,
    currentUser: state.currentUser,
  };

  return props;
};

const Channels = (props) => {
  const { currentUser, chats, socket } = props;

  const preparedChats = chats.allIds.map((id) => chats.byIds[id]);

  const handleAddNewChat = (e) => {
    // Simplify naming with faker.js
    e.preventDefault();
    const fake = faker.hacker.adjective();
    const chatName = `${fake[0].toUpperCase()}${fake.slice(1)}`;
    socket.emit(events.ADD_CHAT_FROM_CLIENT, chatName);
  };

  return (
    <Container>
      {
        preparedChats
          .filter(({ memberIDs }) => memberIDs.includes(currentUser.id))
          .map((chat) => (
            <Chat
              chat={chat}
              socket={socket}
              key={chat.id} />
          ))
      }
      <ButtonWrapper>
        <Button onClick={handleAddNewChat} >&#43; New chat</Button>
      </ButtonWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-content: center;
  width: 30vw;
  border-right: 1px solid #bababa;
`
const ButtonWrapper = styled.div`
  width: 100%;
  height: 20%;
  margin-top: auto;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 1em;
`

const Button = styled.button`
  background: transparent;
  font-size: 1em;
  border: none;
  outline: none;
  color: royalblue;
  font-weight: 600;
  cursor: pointer;
  transition: .2s all;

  :active {
    filter: sepia(1.5);
  }
`

export default connect(mapStateToProps)(Channels);

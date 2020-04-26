import React, { useEffect, useState } from 'react';
import axios from 'axios';
import faker from 'faker';
import styled from 'styled-components';

import events from '../../events';
import consts from '../../consts';

import Chat from '../Chat';

const Channels = (props) => {
  const { socket, currentUser } = props;
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // fetching chats contain currentUser 
      const response = await axios.get(`${consts.SOCKET_URL}/chats/${currentUser.id}`);
      setChats(response.data);
    };
    // subscribe - update chats
    socket.on(events.ADD_CHAT_FROM_SERVER, fetchData);
    socket.on(events.DELETE_CHAT_FROM_SERVER, fetchData);

    // TODO: Notify rest user 

    return () => { // unsubscribe
      socket.off(events.ADD_CHAT_FROM_SERVER, fetchData);
      socket.off(events.DELETE_CHAT_FROM_SERVER, fetchData);
    }
  }, [props.source]);

  const handleAddNewChat = (e) => {
    // Simplify naming with faker.js
    e.preventDefault();
    const fake = faker.hacker.adjective();
    const chatName = `${fake[0].toUpperCase()}${fake.slice(1)}`;
    socket.emit(events.ADD_CHAT_FROM_CLIENT, chatName);
  };

  const handleRemoveChat = (chat, currentUserID) => (e) => {
    e.preventDefault();
    // Only hostUser can do it (!) check...
    if (chat.hostUserID === currentUserID) {
      socket.emit(events.DELETE_CHAT_FROM_CLIENT, chat.id)
    } else {
      // TODO: set behavior if forbiden
    }
  }

  return (
    <Container>
      {
        chats.map((chat) => (
          <Chat
            chat={chat}
            socket={socket}
            // next function use closure and return handler
            handleRemoveChat={handleRemoveChat(chat, currentUser.id)}
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
  color: royalblue;
  font-weight: 600;
  cursor: pointer;

  :hover {
    color: #0541d4;
  }
`

export default Channels;

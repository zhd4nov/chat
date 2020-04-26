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
      <Button onClick={handleAddNewChat} >+ New chat</Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: center;
  width: 20vw;
  padding: .5em;
  border-right: 1px solid rgba(0, 0, 0, .1);
  border-left: 1px solid rgba(0, 0, 0, .1);
`

const Button = styled.button`
  width: 80%;
  height: 5vh;

  border: 1px solid royalblue;
  background: royalblue;
  color: #fff;
  font-weight: 600;
  cursor: pointer;

  :hover {
    background: #0541d4;
  }
`

export default Channels;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import faker from 'faker/locale/fr';
import styled from 'styled-components';

import events from '../../events';
import consts from '../../consts';

const Channels = (props) => {
  const { socket, currentUser } = props;
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // fetching chats contain currentUser 
      const response = await axios.get(`${consts.SOCKET_URL}/chats/${currentUser.id}`);
      setChats(response.data);
    };
    // subscribe
    socket.on(events.ADD_CHAT_FROM_SERVER, fetchData);

    return () => { // unsubscribe
      socket.off(events.ADD_CHAT_FROM_SERVER, fetchData);
    }
  }, [props.source]);

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
        chats.map((chat) => <Chat key={chat.id} />)
      }
      <Button onClick={handleAddNewChat} >+ new chat</Button>
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
  border-right: 1px solid #ccc;
  border-left: 1px solid #ccc;
`

const Chat = styled.div`
  width: 100%;
  height: 7vh;
  margin-bottom: .25em;
  background: #ccc;
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

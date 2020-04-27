import React, { Fragment, useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import styled from 'styled-components';

import events from '../../events';
import consts from '../../consts';

import Messages from '../Messages';
import SendingForm from '../SendingForm';
import Channels from '../Channels';
import StatusBar from '../StatusBar';
import IntroModal from '../IntroModal';

const socket = io.connect(consts.SOCKET_URL);

// Use closure to building a universal fetch
const fetchData = (resource, ...restPath) => async () => {
  // ** [, ...restPath] is optional, should contain strings **
  let path;
  if (restPath.length > 0) {
    path = restPath.join('/') // restPath contains something
  } else {
    path = ''; // restPath is empty
  }

  // Use destructuring to get data from server response
  const { data } = await axios.get(
    `${consts.SOCKET_URL}/${resource}/${path}`,
  );

  return data;
};

// Resources for request builder
const resource = {
  messages: 'messages',
  chats: 'chats',
  users: 'users',
};

const App = () => {
  // Init appState - single source of truth
  const [appState, setAppState] = useState({
    currentUser: { name: '' }, // REFACTOR: Need to put a real user object
    chats: [], // All chats owned by appState.currentUser
    currentChatId: null, // Will be defined in UseEffect hook
    messages: [], // Messages from appState.currentChatId
  });

  useEffect(() => {
    const updateChats = async () => {
      const chats = await fetchData(resource.chats)();
      setAppState({
        ...appState,
        chats,
        currentChatId: chats[0]['id'],
      });
    };

    socket.on(events.ADD_CHAT_FROM_SERVER, updateChats);
    socket.on(events.DELETE_CHAT_FROM_SERVER, updateChats);

    const updateMessages = async () => {
      const messages = await fetchData(resource.messages, appState.currentChatId)();
      setAppState({
        ...appState,
        messages,
      });
    };

    socket.on(events.ADD_MESSAGE_FROM_SERVER, updateMessages);

    return () => {
      socket.off(events.ADD_CHAT_FROM_SERVER, updateChats);
      socket.off(events.DELETE_CHAT_FROM_SERVER, updateChats);
      socket.off(events.ADD_MESSAGE_FROM_SERVER, updateMessages);
    }
  })

  const createNewUser = (name) => {
    socket.emit(events.ADD_USER_FROM_CLIENT, name);
  };

  const rememberCurrentUser = (user) => {
    // handle response from server in IntroModal (i)
    setAppState({ ...appState, currentUser: user });
  };

  const handleCurrentChat = (id) => () => setAppState({ ...appState, currentChatId: id });

  const handleNewMessage = (messageText) => {
    socket.emit(
      events.ADD_MESSAGE_FROM_CLIENT,
      { newMessage: messageText, chatId: appState.currentChatId },
    );
  }

  const isExist = (userName) => {
    const exist = userName.length !== 0;
    return exist;
  };

  const app = (
    <Fragment>
      <StatusBar currentUser={appState.currentUser} />
      <Workspace>
        <Channels
          chats={appState.chats}
          socket={socket}
          currentUser={appState.currentUser}
          currentChatId={appState.currentChatId}
          handleCurrentChat={handleCurrentChat} />
        <ChatViewport>
          <Messages messages={appState.messages} />
          <SendingForm onSubmit={handleNewMessage} />
        </ChatViewport>
      </Workspace>
    </Fragment>
  );

  return (
    <AppContainer>
      { // First, ask user name
        isExist(appState.currentUser.name)
          ? app // if user name is exist return our app
          : <IntroModal
            createNewUser={createNewUser}
            rememberCurrentUser={rememberCurrentUser}
            socket={socket} />
      }
    </AppContainer>
  );
};

const AppContainer = styled.div`
  width: 80%;
  max-width: 900px;
  height: 100vh;
  max-height: 100vh;
  margin: 0 auto;

  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  font-family: sans-serif;
`

const Workspace = styled.main`
  width: 100%;
  height: 90vh;
  display: flex;
  flex-flow: row nowrap;
  border-left: 1px solid #bababa;
  border-right: 1px solid #bababa;
`

const ChatViewport = styled.div`
  width: 70vw;
  min-height: 100%;

  display: flex;
  flex-flow: column nowrap;
  padding: 0 3em;
`

export default App;
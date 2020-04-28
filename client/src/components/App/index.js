import React, { Fragment, useState, useEffect } from 'react';
import io from 'socket.io-client';
import cookie from 'js-cookie';
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
    users: [], // Actual a user list
    currentUser: { name: '' }, // REFACTOR: Need to put a real user object
    chats: [], // All chats owned by appState.currentUser
    currentChatId: null, // Will be defined in UseEffect hook
    messages: [], // Messages from appState.currentChatId
  });

  useEffect(() => {
    const updateChats = async () => {
      const chats = await fetchData(resource.chats)();
      const userChats = chats.filter((chat) => chat.memberIDs.includes(appState.currentUser.id));

      setAppState({
        ...appState,
        chats,
        currentChatId: userChats.length > 0
          ? userChats[0]['id']
          : null, // Sorry i'm in a hurry (:
        // This code choose a first chat of user chats and activate it
      });
      console.log('Update chats... yeah: ', chats); // CONSOLE (x
    };

    const updateMessages = async () => {
      const messages = await fetchData(resource.messages)();
      setAppState({
        ...appState,
        messages,
      });
      console.log('Update messages... yeah'); // CONSOLE (x)
    };

    const updateUsers = (user) => {
      // handle response from server in IntroModal (i)
      setAppState({
        ...appState,
        users: [...appState.users, user],
      });
      console.log('Update users... yeah\n', user); // CONSOLE (x
    };

    const updateCurrentUser = (user) => {
      setAppState({ ...appState, currentUser: user });
    }

    socket.on(events.ADD_USER_FROM_SERVER, updateUsers);
    socket.on(events.ADD_USER_FROM_SERVER, updateCurrentUser);

    socket.on(events.ADD_CHAT_FROM_SERVER, updateChats);

    socket.on(events.DELETE_CHAT_FROM_SERVER, updateMessages);
    socket.on(events.DELETE_CHAT_FROM_SERVER, updateChats);

    socket.on(events.ADD_MESSAGE_FROM_SERVER, updateMessages);

    socket.on(events.ADD_FRIEND_FROM_SERVER, updateUsers);
    socket.on(events.ADD_FRIEND_FROM_SERVER, updateMessages);
    socket.on(events.ADD_FRIEND_FROM_SERVER, updateChats);

    return () => {
      socket.off(events.ADD_CHAT_FROM_SERVER, updateChats);
      socket.off(events.DELETE_CHAT_FROM_SERVER, updateMessages);
      socket.off(events.DELETE_CHAT_FROM_SERVER, updateChats);
      socket.off(events.ADD_MESSAGE_FROM_SERVER, updateMessages);
      socket.off(events.ADD_USER_FROM_SERVER, updateUsers);
      socket.off(events.ADD_USER_FROM_SERVER, updateCurrentUser);

      socket.off(events.ADD_FRIEND_FROM_SERVER, updateUsers);
      socket.off(events.ADD_FRIEND_FROM_SERVER, updateMessages);
      socket.off(events.ADD_FRIEND_FROM_SERVER, updateChats);
    }
  })

  const createNewUser = (name) => {
    // Get user invite
    const chatId = cookie.get('invite');
    // And return Boolean
    const hasInvite = !!chatId;
    // Create user data
    const userInfo = {
      hasInvite,
      chatId,
      name,
    }
    // Send user data
    socket.emit(events.ADD_USER_FROM_CLIENT, userInfo);
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
      <StatusBar currentUser={appState.currentUser} currentChatId={appState.currentChatId} />
      <Workspace>
        <Channels
          chats={appState.chats}
          socket={socket}
          currentUser={appState.currentUser}
          currentChatId={appState.currentChatId}
          handleCurrentChat={handleCurrentChat} />
        <ChatViewport>
          <Messages
            messages={appState.messages}
            currentChatId={appState.currentChatId} />
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
          : <IntroModal createNewUser={createNewUser} />
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
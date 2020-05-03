import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import cookie from 'js-cookie';
import styled from 'styled-components';

import events from '../../events';
import consts from '../../consts';

// Get redux actions
import * as actions from '../../actions';

import Messages from '../Messages';
import SendingForm from '../SendingForm';
import Channels from '../Channels';
import StatusBar from '../StatusBar';
import IntroModal from '../IntroModal';

const socket = io.connect(consts.SOCKET_URL);

// Get app state from redux store
const mapStateToProps = (state) => {
  const props = {
    users: state.users,
    chats: state.chats,
    messages: state.messages,
    currentUser: state.currentUser,
    // TODO: NEED to Current User definition
  };

  return props;
};
// Create actions
const actionCreators = {
  updateUsers: actions.updateUsers,
  updateChats: actions.updateChats,
  updateMessages: actions.updateMessages,
  setCurrentUser: actions.setCurrentUser,
}

const App = (props) => { // Props include state and actions
  // Get app state from props
  const { users, chats, messages, currentUser } = props;

  useEffect(() => {
    // Get actual state from server
    // TODO: Refactor - one function (?)
    const fetchChats = () => {
      // Fetching data inside the action
      const { updateChats } = props; // Get the right action
      updateChats(); // Dispatch... Boom!
    };

    const fetchMessages = () => {
      // Fetching data inside the action
      const { updateMessages } = props; //Get the right action
      updateMessages() // Dispatch... Boom!
    };

    const fetchUsers = () => {
      // Fetching data inside the action
      const { updateUsers } = props; // Get the right action
      updateUsers(); // Dispatch... Boom!
    };

    const updateCurrentUser = (user) => {
      const { setCurrentUser } = props;
      setCurrentUser({ user });
    };

    socket.on(events.ADD_USER_FROM_SERVER, fetchUsers);
    socket.on(events.ADD_USER_FROM_SERVER, updateCurrentUser);

    socket.on(events.ADD_CHAT_FROM_SERVER, fetchChats);

    socket.on(events.DELETE_CHAT_FROM_SERVER, fetchMessages);
    socket.on(events.DELETE_CHAT_FROM_SERVER, fetchChats);

    socket.on(events.ADD_MESSAGE_FROM_SERVER, fetchMessages);

    socket.on(events.ADD_FRIEND_FROM_SERVER, fetchUsers);
    socket.on(events.ADD_FRIEND_FROM_SERVER, fetchMessages);
    socket.on(events.ADD_FRIEND_FROM_SERVER, fetchChats);

    return () => {
      socket.off(events.ADD_CHAT_FROM_SERVER, fetchChats);
      socket.off(events.DELETE_CHAT_FROM_SERVER, fetchMessages);
      socket.off(events.DELETE_CHAT_FROM_SERVER, fetchChats);
      socket.off(events.ADD_MESSAGE_FROM_SERVER, fetchMessages);
      socket.off(events.ADD_USER_FROM_SERVER, fetchUsers);
      socket.off(events.ADD_USER_FROM_SERVER, updateCurrentUser);

      socket.off(events.ADD_FRIEND_FROM_SERVER, fetchUsers);
      socket.off(events.ADD_FRIEND_FROM_SERVER, fetchMessages);
      socket.off(events.ADD_FRIEND_FROM_SERVER, fetchChats);
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

  // TODO: Resolve current chat problem
  const app = (
    <Fragment>
      <StatusBar currentUser={currentUser} currentChatId={null} />
      <Workspace>
        <Channels
          chats={chats.allIds.map((chatId) => chats.byIds[chatId])}
          socket={socket}
          currentUser={currentUser}
          currentChatId={null}
          handleCurrentChat={handleCurrentChat} />
        <ChatViewport>
          <Messages
            messages={messages.allIds.map((msgId) => messages.byIds[msgId])}
            currentUser={currentUser}
            currentChatId={null} />
          <SendingForm onSubmit={handleNewMessage} />
        </ChatViewport>
      </Workspace>
    </Fragment>
  );

  return (
    <AppContainer>
      { // First, ask user name
        currentUser.name
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

export default connect(mapStateToProps, actionCreators)(App);
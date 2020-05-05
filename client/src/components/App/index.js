import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
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
import VideoCall from '../VideoCall';

const socket = io.connect(consts.SOCKET_URL);

// Get app state from redux store
const mapStateToProps = (state) => {
  const props = {
    currentUser: state.currentUser,
    conversationMode: state.conversationMode,
  };

  return props;
};
// Create actions
const actionCreators = {
  updateUsers: actions.updateUsers,
  updateChats: actions.updateChats,
  updateMessages: actions.updateMessages,
  setCurrentUser: actions.setCurrentUser,
  setCurrentChat: actions.setCurrentChat,
};

const App = (props) => { // Props include state and actions
  // Get app state from props
  const { currentUser, conversationMode } = props;

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

    socket.on(events.USER_LEAVE_FROM_SERVER, fetchChats);

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

      socket.off(events.USER_LEAVE_FROM_SERVER, fetchChats);
    }
  })

  const app = (
    <Fragment>
      <StatusBar />
      <Workspace>
        <Channels socket={socket} />
        <ChatViewport>
          <Messages />
          <SendingForm socket={socket} />
        </ChatViewport>
        {conversationMode === 'video' && <VideoCall />}
      </Workspace>
    </Fragment>
  );

  return (
    <AppContainer>
      { // First, ask user name
        currentUser.name
          ? app // if user name is exist return our app
          : <IntroModal socket={socket} />
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
`;

const ChatViewport = styled.div`
  width: 70vw;
  min-height: 100%;

  display: flex;
  flex-flow: column nowrap;
  padding: 0 3em;
`;

export default connect(mapStateToProps, actionCreators)(App);
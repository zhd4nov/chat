import React, { Fragment, useState, useEffect } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';

import events from '../../events';
import consts from '../../consts';

import Messages from '../Messages';
import Form from '../Form';
import Channels from '../Channels';
import StatusBar from '../StatusBar';
import IntroModal from '../IntroModal';

const socket = io.connect(consts.SOCKET_URL);

const App = () => {
  const [currentUser, setCurrentUser] = useState({
    name: '',
  });
  const createNewUser = (name) => {
    socket.emit(events.ADD_USER_FROM_CLIENT, name);
  };

  const rememberCurrentUser = (user) => { // handle response from server in IntroModal (i)
    setCurrentUser(user);
  };

  const isExist = (userName) => {
    const exist = userName.length !== 0;
    return exist;
  };

  const app = (
    <Fragment>
      <StatusBar />
      <Channels />
      <Messages />
      <Form />
    </Fragment>
  );

  return (
    <AppContainer>
      {
        isExist(currentUser.name)
          ? app
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
  margin: 0 auto;

  display: flex;
  font-family: sans-serif;
`



export default App;
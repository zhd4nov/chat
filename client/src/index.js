import React, { Fragment, useState, useEffect } from 'react';
import { render } from 'react-dom';
import io from 'socket.io-client';
import 'babel-polyfill';

import consts from './consts';
import events from './events';

import Messages from './components/Messages';
import Form from './components/Form';
import Channels from './components/Channels';
import StatusBar from './components/StatusBar';

const socket = io.connect(consts.SOCKET_URL);

const App = () => {
  const [messages, setMessages] = useState([
    {
      name: 'User',
      time: '14:30',
      text: 'Hey you guys!',
    }
  ]);

  const [user, setUser] = useState({
    id: 1,
    name: 'John Dow',
    channels: [],
  });

  return (
    <div>
      {
        user.name ?
          <Fragment>
            {/* TODO: bar implementation, some information - avatar, current user, etc.*/}
            <StatusBar user={user} />
            {/* active channels from user if exist */}
            <Channels />
            {/* messages from channels if exist */}
            <Messages messages={messages} />
            <Form />
          </Fragment> :
          <Fragment>
            <h3>Your name please:</h3>
            {/* Modal */}
          </Fragment>
      }
    </div>
  );
};

render(<App />, document.getElementById('root'));

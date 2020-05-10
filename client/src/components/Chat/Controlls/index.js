import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import events from '../../../events';

// icons:
import Cross from '../../../assets/chat-controls/remove.svg';
import Invite from '../../../assets/chat-controls/invite.svg';
import Edit from '../../../assets/chat-controls/edit.svg';

const Container = styled.div`
  position: absolute;
  height: 100%;
  left: 10%;

  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  padding: .5em 0;
`;

const Controlls = ({ socket, chat, currentUser }) => {

  const handleRemoveChat = (chat) => () => {
    // Only hostUser can do it (!) check...
    if (chat.hostUserID === currentUser.id) {
      socket.emit(events.DELETE_CHAT_FROM_CLIENT, chat.id)
    } else {
      // TODO: set behavior if forbiden
    }
  };

  return (
    <Container>
      <div>
        <Cross onClick={handleRemoveChat(chat)} />
      </div>
      <div>
        <Invite />
      </div>
      <div>
        <Edit />
      </div>
    </Container>
  );
};

const mapStateToProps = (state) => {
  const props = {
    currentUser: state.currentUser,
  };

  return props;
};

export default connect(mapStateToProps)(Controlls);

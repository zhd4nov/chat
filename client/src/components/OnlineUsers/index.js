import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

const User = (props) => {
  const { className, user } = props;

  return (
    <div className={className}>
      <p className="name">{user.name}</p>
      <div className="avatar"></div>
    </div>
  );
};

const StyledUser = styled(User)`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: .5em;
  padding-right: 1.5em;

  .avatar {
    width: 2em;
    height: 2em;
    border-radius: 50%;
    background: royalblue;
    }

  .name {
    color: #bababa;
    margin-right: .5em;
    fon-size: .8em;
  }
`;

const mapStateToProps = (state) => {
  const props = {
    users: state.users,
    chats: state.chats,
    currentChat: state.currentChat,
  };

  return props;
};

const OnlineUsers = (props) => {
  // Unzip props
  const { className, users, chats, currentChat } = props;
  // Get users from current chat
  // TODO: clean members when user disconnect (!)
  const { memberIDs } = chats.byIds[currentChat];
  const currentUsers = memberIDs.map((userId) => users.byIds[userId]);

  return (
    <div className={className}>
      {
        currentUsers.map((user) => <StyledUser user={user} key={user.id} />)
      }
    </div>
  );
};

const styledOnlineUsers = styled(OnlineUsers)`
  position: absolute;
  top: 10vh;
  right: 0;
`;

export default connect(mapStateToProps)(styledOnlineUsers);

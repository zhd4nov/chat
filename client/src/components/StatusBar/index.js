import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import consts from '../../consts';

import OnlineUsersList from '../OnlineUsers';
import Users from '../../assets/online-users.svg';
import Video from '../../assets/video.svg';

const StatusBar = ({ currentUser, currentChatId }) => {
  const { name } = currentUser;
  const inviteLink = `${consts.SOCKET_URL}/users/invite/${currentChatId}`;

  const [showUsers, setShowUsers] = useState(false);

  const handleShowUsers = (e) => {
    setShowUsers(!showUsers);
  };

  const handleCopyLink = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(e.target.getAttribute('href')).then(() => {
      console.log('success');
    }, () => {
      console.log('fail');
    });
  }

  return (
    <Container>
      <Avatar />
      {/* Status Bar has font-variant: small-caps. Format text to lower case. */}
      <Name>{name.toLowerCase()}</Name>
      <a href={inviteLink} onClick={handleCopyLink}>copy invite link</a>
      <StyledVideo />
      <StyledUsers onClick={handleShowUsers} />
      {showUsers && <OnlineUsersList />}
    </Container>
  );
};

const Container = styled.header`
  width: 100%;
  height: 10vh;
  position: relative;

  display: flex;
  align-items: center;
  background: royalblue;
  color: #fff;

  >a {
    text-decoration: none;
    color: #fff;
    font-variant: small-caps;
    font-weight: 600;
    margin-left: auto;
    margin-right: 1.5em;
    transition: all .2s;
    :hover {
      transform: rotate(5deg);
      text-shadow: 0 0 1em rgba(255, 255, 255, 0.1);
    }
    :active {
      position: relative;
      top: .2em;
    }
  }
`;

const Avatar = styled.div`
  width: 7vh;
  height: 7vh;
  border-radius: 50%;
  margin: 0 1em 0 1.5em;

  background: #fff;
`;

const Name = styled.p`
  font-weight: 600;
  font-variant: small-caps;
`;

const StyledUsers = styled(Users)`
  margin-right: 1.5em;
  cursor: pointer;

  :hover {
    text-shadow: 0 0 10px #fff;
  }
`;
const StyledVideo = styled(Video)`
  margin-right: 1.5em;
`;

export default StatusBar;

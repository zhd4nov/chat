import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import consts from '../../consts';

const StatusBar = ({ currentUser, currentChatId }) => {
  const { name } = currentUser;
  const inviteLink = `${consts.SOCKET_URL}/users/invite/${currentChatId}`;

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
      <Friends>who's online in this chat</Friends>
    </Container>
  );
};

const Container = styled.header`
  width: 100%;
  height: 10vh;

  display: flex;
  align-items: center;
  background: royalblue;
  color: #fff;

  >a {
    color: #fff;
    font-variant: small-caps;
    margin: 0 auto;
  }
`

const Avatar = styled.div`
  width: 7vh;
  height: 7vh;
  border-radius: 50%;
  margin: 0 1em 0 1.5em;

  background: #fff;
`

const Name = styled.p`
  font-size: .8em;
  font-weight: 600;
  font-variant: small-caps;
`

const Friends = styled.span`
  margin-left: auto;
  margin-right: 1.5rem;
  font-variant: small-caps;
  font-size: .8em;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s;

  :hover {
    transform: rotate(5deg);
    text-shadow: 0 0 1em rgba(255, 255, 255, 0.1);
  }
`

export default StatusBar;

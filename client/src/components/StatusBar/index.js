import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StatusBar = ({ currentUser }) => {
  const { name } = currentUser;

  return (
    <Container>
      <Avatar />
      {/* Status Bar has font-variant: small-caps. Format text to lower case. */}
      <Name>{name.toLowerCase()}</Name>
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

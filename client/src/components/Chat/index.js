import React from 'react';

import styled from 'styled-components';

import events from '../../events';
import consts from '../../consts';

const Chat = ({ chat, handleRemoveChat }) => {
  const { name } = chat;

  return (
    <Container>
      <Title>{name}</Title>
      <CloseCross onClick={handleRemoveChat} >&#10006;</CloseCross>
    </Container>
  );
};


const Container = styled.div`
  position: relative;
  width: 100%;
  height: 7vh;
  margin-bottom: .25em;

  display: flex;

  background: rgba(0, 0, 0, .1);
`

const Title = styled.p`
  width: fit-content;
  margin: auto;
  font-weight: 600;
  color: #39393a;
  cursor: pointer;
`

const CloseCross = styled.button`
  position: absolute;
  top: .5em;
  right: .5em;

  border: none;
  outline: none;
  background: transparent;
  font-size: .7em;
  color: #39393a;
  cursor: pointer;
  transition: all .2s;

  :hover {
    color: tomato;
  }
`

export default Chat;

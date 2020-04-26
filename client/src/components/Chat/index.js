import React from 'react';
import styled from 'styled-components';

// TODO: Rename chat; what's about styles?
const Chat = ({ chat, handleRemoveChat }) => {
  //TODO: Add active chat and separate styles (!)
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

  display: flex;
  cursor: pointer;

  ::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);

    width: 80%;
    height: 1px;
    background: #bababa;
  }
`

const Title = styled.p`
  width: fit-content;
  margin: auto;
  color: #bababa;
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

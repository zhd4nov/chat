import React from 'react';
import styled from 'styled-components';

const Messages = (props) => {
  return (
    <Container>
      <Message>
        <Author>Evgeny</Author>
        <Text>Hi! I love you, guys.</Text>
        <Timestamp>14:30</Timestamp>
      </Message>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 70%;

  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  padding: .5em 1em;

  border-right: 1px solid rgba(0, 0, 0, .1);
  border-bottom: 1px solid rgba(0, 0, 0, .1);
`

const Message = styled.div`
  position: relative;
  width: 60%;
  padding: 2em 1em 1em;

  background: rgba(0, 0, 0, .1);
  border-radius: .2em;
`

const Author = styled.span`
  position: absolute;
  top: .5em;
  left: .5em;

  font-size: .8em;
`

const Text = styled.p`
  width: 100%;
`
const Timestamp = styled.span`
  position: absolute;
  top: .5em;
  right: .5em;

  font-size: .8em;
  color: #39393a;
`

export default Messages;

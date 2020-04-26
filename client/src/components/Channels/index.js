import React from 'react';
import styled from 'styled-components';

const Channels = (props) => {
  const { socket } = props;

  return (
    <Container>
      <Chat />
      <Chat />
    </Container>
  );
};

const Container = styled.div`
  width: 20vw;
  padding: .5em;
  border-right: 1px solid #ccc;
  border-left: 1px solid #ccc;
`

const Chat = styled.div`
  width: 100%;
  height: 7vh;
  margin-bottom: .25em;
  background: #ccc;
`

export default Channels;

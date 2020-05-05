import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

const mapStateToProps = (state) => {
  const props = {
    currentUser: state.currentUser,
  };

  return props;
};

const Message = ({ message, currentUser }) => {
  const {
    authorId,
    authorName,
    text,
    time } = message;

  return (
    <Container right={authorId === currentUser.id}>
      <Author>{authorName}</Author>
      <Text>{text}</Text>
      <Timestamp>{time}</Timestamp>
    </Container>
  );
};

const messagePosition = {
  right: 'left',
  left: 'right',
};

const Container = styled.div`
  position: relative;
  margin-right:${(props) => props.right
    ? '.8em'
    : '0'};
  margin-${(props) => props.right
    ? messagePosition.right
    : messagePosition.left}: auto;
  text-align: right;
  width: 60%;
  padding: 2em 1em 1em;
  margin-bottom: .5em;
  color: #fff;
  background-color: ${(props) => props.right
    ? 'royalblue'
    : 'gray'};
  border-radius: .2em;
`;

const Author = styled.span`
  position: absolute;
  top: .5em;
  left: 1em;

  font-size: .5em;
`;

const Text = styled.p`
  width: 100%;
  font-size: .8em;
`;

const Timestamp = styled.span`
  position: absolute;
  top: .5em;
  right: 1em;

  font-size: .5em;
`;

export default connect(mapStateToProps)(Message);

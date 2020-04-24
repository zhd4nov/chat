import React from 'react';

const Message = ({ text, name, time }) => (
  <div className="name">
    <b>{name}:</b><br />{time}<br />{text}
  </div>
);

const Messages = ({ messages = [] }) => {
  if (messages.length === 0) {
    return <div className="no-messages">You have no messages yet...</div>
  }

  return messages.map((message, i) => {
    return <Message {...message} key={i} />
  });
};

export default Messages;

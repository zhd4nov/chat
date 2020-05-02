import React from 'react';
import styled from 'styled-components';

const User = ({ className }) => {
  return (
    <div className={className}>
      <p className="name">Mister User</p>
      <div className="avatar"></div>
    </div>
  );
};

const StyledUser = styled(User)`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: .5em;
  margin-right: 1.5em;

  div.avatar {
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


const OnlineUsers = ({ className }) => {
  return (
    <div className={className}>
      <StyledUser />
      <StyledUser />
      <StyledUser />
      <StyledUser />
    </div>
  );
};

const styledOnlineUsers = styled(OnlineUsers)`
  position: absolute;
  top: 10vh;
  right: 0;
`;

export default styledOnlineUsers;

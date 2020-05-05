import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as actions from '../../actions';

const mapStateToProps = (state) => {
  const props = {
    currentUser: state.currentUser,
  };

  return props;
};

const actionCreators = {
  setConversationMode: actions.setConversationMode,
};

const getMediaData = async () => {
  let stream;

  try {
    stream = await navigator
      .mediaDevices
      .getUserMedia({ audio: false, video: true });
  } catch (e) {
    console.log(`Get user media fail: ${e}`);
  }

  return stream;
};

const VideoCall = (props) => {
  const { currentUser } = props;

  const videoRef = useRef(null);

  useEffect(() => {
    let stream;

    const mountStream = async () => {
      stream = await getMediaData();
      videoRef.current.srcObject = stream;
      console.log('Mount media is done.');
    };

    mountStream();

    return () => {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, [videoRef]);

  const handleEndCall = (e) => {
    e.preventDefault();
    const { setConversationMode } = props;
    setConversationMode({ mode: 'text' });
  };

  return (
    <Wrapper>
      <Container>
        <p>{currentUser.name}</p>
        <Video ref={videoRef} autoPlay>
          <p>What</p>
        </Video>
        <EndCall onClick={handleEndCall} >
          End Call
        </EndCall>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .5);

  display: flex;

  z-index: 1000;
`;

const Container = styled.div`
  width: 50vmax;
  max-width: 100vw;
  height: 50vmax;
  max-height: 100vh;
  background: #fff;
  text-align: center;
  padding-top: 1em;
  margin: auto;

  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`;

const Video = styled.video`
  width: 100%;
  height: 80%;
`;

const EndCall = styled.button`
  border: none;
  background: tomato;
  color: #fff;
  padding: 1em 2em;
  margin-top: auto;
  margin-bottom: 1em;
`;

export default connect(mapStateToProps, actionCreators)(VideoCall);

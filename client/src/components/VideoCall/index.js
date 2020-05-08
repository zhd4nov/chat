import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import Peer from 'simple-peer';
import styled from 'styled-components';

import * as actions from '../../actions';

const mapStateToProps = (state) => {
  const props = {
    currentUser: state.currentUser,
    chats: state.chats,
    currentChat: state.currentChat,
    videoCall: state.videoCall,
  };

  return props;
};

const actionCreators = {
  setConversationMode: actions.setConversationMode,
  updateVideoCall: actions.updateVideoCall,
};

const getMediaData = async () => {
  let stream;

  try {
    stream = await navigator
      .mediaDevices
      .getUserMedia({ audio: true, video: true });
  } catch (e) {
    console.log(`Get user media fail: ${e}`);
  }

  return stream;
};

const VideoCall = (props) => {
  const { currentUser, socket, videoCall } = props;

  const [waitToCall, setWaitToCall] = useState(true);
  const [stream, setStream] = useState();

  const localVideo = useRef(null);
  const remoteVideo = useRef(null);

  useEffect(() => {
    getMediaData().then((stream) => {
      setStream(stream);
      if (localVideo.current) {
        localVideo.current.srcObject = stream;
      }
    });
  }, []);

  const callPeer = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: currentUser.id })
    });

    socket.on('callAccepted', (signal) => {
      const { updateVideoCall } = props;
      updateVideoCall({ videoCall: { ...videoCall, callAccepted: true } });
      peer.signal(signal);
    });

    peer.on('stream', (stream) => {
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = stream;
      }
    });

    socket.on('endCall', () => {
      const { setConversationMode } = props;
      // Hide video call window
      setConversationMode({ mode: 'text' });
      // Disable stream
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      // Close connection
      peer.destroy();
    });
  };

  const acceptCall = () => {
    const { updateVideoCall } = props;
    updateVideoCall({ videoCall: { ...videoCall, callAccepted: true } });
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socket.emit('acceptCall', { signal: data, to: videoCall.caller });
    });

    peer.signal(videoCall.callerSignal);

    peer.on('stream', (stream) => {
      remoteVideo.current.srcObject = stream;
    });

    socket.on('endCall', () => {
      // Hide video call window
      const { setConversationMode } = props;
      setConversationMode({ mode: 'text' });
      // Disable stream
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      // Close connection
      peer.destroy();
    });
  }
  // TODO: Refactor end call process
  const handleEndCall = (e) => {
    e.preventDefault();
    const { setConversationMode } = props;
    setConversationMode({ mode: 'text' });
    socket.emit('endCall', { from: currentUser.id, name: currentUser.name });
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  };


  const renderCallButton = () => {
    const { chats, currentChat } = props;
    const partner = chats
      .byIds[currentChat]
      .memberIDs
      .filter((id) => id !== currentUser.id);

    if (videoCall.receivingCall) {
      return (
        <CallBox>
          {/* onClick={acceptCall} */}
          <button onClick={() => {
            setWaitToCall(false);
            acceptCall();
          }}>Accept Call</button>
        </CallBox>
      );
    }

    return (
      <CallBox>
        {/* onClick={callPeer} */}
        <button onClick={() => {
          setWaitToCall(false);
          callPeer(partner);
        }}>Call Partner</button>
      </CallBox>
    );
  };

  return (
    <Wrapper>
      <Container>
        <Video playsInline muted ref={localVideo} autoPlay />
        {
          waitToCall
            ? renderCallButton()
            : <Video playsInline ref={remoteVideo} autoPlay />
        }
        <EndCall onClick={handleEndCall} >
          Hang up
        </EndCall>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .5);

  display: flex;

  z-index: 1000;
`;

const Container = styled.div`
  position: relative;
  width: 75%;
  height: 90%;
  background: #fff;
  text-align: center;
  padding: .5em;
  margin: auto;

  display: flex;
  flex-flow: row wrap;
  align-items: center;
`;

const Video = styled.video`
  margin: .5em;
  width: calc(50% - 1em);
`;

const CallBox = styled.div`
  margin: .5em;
  width: calc(50% - 1em);
  > button {
    color: #fff;
    background-color: green;
    border: none;
    padding: 1em 2em;
    cursor: pointer;
    :hover {
      filter: saturate(1.2);
    }
  }
`;

const EndCall = styled.button`
  position: absolute;
  top: 1em;
  left: 1em;

  border: none;
  background: tomato;
  color: #fff;
  padding: 1em 2em;
  cursor: pointer;
  :hover {
    filter: saturate(1.2);
  }
`;

export default connect(mapStateToProps, actionCreators)(VideoCall);

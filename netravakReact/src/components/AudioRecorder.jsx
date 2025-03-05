import React, { useState, useEffect } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import styled, { keyframes } from "styled-components";

// 🔹 Pulse animation
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(2); opacity: 0; }
`;

// 🔹 Pulse effect container
const RingContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
`;

// 🔹 Pulse effect
const PulseRing = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 100%;
  background-color: rgba(255, 0, 0, 0.4);
  animation: ${pulse} 1.5s ease-out infinite;
  z-index: 0;

  &:nth-child(2) { animation-delay: 0.5s; }
  &:nth-child(3) { animation-delay: 1s; }
`;

// 🔹 Styled Button
const RecordButton = styled.button`
  position: relative;
  z-index: 1;
  background-color: ${(props) => (props.recording ? "#d32f2f" : "#f44336")};
  color: white;
  border: none;
  padding: 40px;
  font-size: 16px;
  cursor: pointer;
  outline: none;
  transition: background 0.3s;

  &:hover {
    background-color: ${(props) => (props.recording ? "#b71c1c" : "#e53935")};
  }
`;

const AudioRecorder = ({ setAudioUrl }) => {
  const [recording, setRecording] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);

  return (
    <div className="flex flex-col items-center">
      <ReactMediaRecorder
        audio={{ echoCancellation: true, noiseSuppression: true }}
        blobPropertyBag={{ type: "audio/flac" }}
        render={({ status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl }) => {
          useEffect(() => {
            if (mediaBlobUrl) {
              setBlobUrl(mediaBlobUrl);
              setAudioUrl(mediaBlobUrl); 
            }
          }, [mediaBlobUrl]);
          return (
            <div className="flex flex-col items-center">
              <p>Status: {status}</p>
              <RingContainer>
                {recording && (
                  <>
                    <PulseRing />
                    <PulseRing />
                    <PulseRing />
                  </>
                )}
                <RecordButton
                  className="rounded-full"
                  onClick={() => {
                    if (!recording) {
                      setRecording(true);
                      startRecording();
                    } else {
                      setRecording(false);
                      stopRecording();
                    }
                  }}
                >
                  {recording ? "Stop" : "Start"}
                </RecordButton>
              </RingContainer>

              <button className="bg-gray-300 border-2 p-4 mt-4" onClick={() => {
                clearBlobUrl();
                setBlobUrl(null);
                setAudioUrl(null);
              }}>
                Clear
              </button>

              {blobUrl && <audio src={blobUrl} controls />}
            </div>
          );
        }}
      />
    </div>
  );
};

export default AudioRecorder;

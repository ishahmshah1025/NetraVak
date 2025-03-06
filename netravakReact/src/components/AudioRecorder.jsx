import React, { useState, useEffect } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import styled, { keyframes } from "styled-components";

// 🔹 Pulse animation for recording effect
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(2); opacity: 0; }
`;

// 🔹 Styled Components for UI
const RingContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
`;

// 🔹 Pulsating effect when recording
const PulseRing = styled.div`
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 100%;
  background-color: rgba(255, 0, 0, 0.4);
  animation: ${pulse} 1.5s ease-out infinite;
  z-index: 0;

  &:nth-child(2) { animation-delay: 0.5s; }
  &:nth-child(3) { animation-delay: 1s; }
`;

// 🔹 Styled Recording Button
const RecordButton = styled.button`
  position: relative;
  z-index: 1;
  background-color: ${(props) => (props.recording ? "#d32f2f" : "#f44336")};
  color: white;
  border: none;
  padding: 20px 40px;
  font-size: 16px;
  border-radius: 50px;
  cursor: pointer;
  outline: none;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background-color: ${(props) => (props.recording ? "#b71c1c" : "#e53935")};
    transform: scale(1.05);
  }
`;

const AudioRecorder = ({ setAudioUrl }) => {
  const [recording, setRecording] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">🎤 Audio Recorder</h2>

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
              <p className="mb-2">Status: <strong>{status}</strong></p>

              <RingContainer>
                {recording && (
                  <>
                    <PulseRing />
                    <PulseRing />
                    <PulseRing />
                  </>
                )}
                <RecordButton
                  onClick={() => {
                    if (!recording) {
                      setRecording(true);
                      startRecording();
                    } else {
                      setRecording(false);
                      stopRecording();
                    }
                  }}
                  recording={recording}
                >
                  {recording ? "Stop Recording" : "Start Recording"}
                </RecordButton>
              </RingContainer>

              {/* 🔹 Audio Controls */}
              {blobUrl && (
                <div className="mt-4 text-center">
                  <audio src={blobUrl} controls className="w-60 mb-2" />
                  
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = blobUrl;
                        a.download = "recording.flac";
                        a.click();
                      }}
                    >
                      📥 Download
                    </button>

                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                      onClick={() => {
                        clearBlobUrl();
                        setBlobUrl(null);
                        setAudioUrl(null);
                      }}
                      disabled={!blobUrl}
                    >
                      ❌ Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default AudioRecorder;

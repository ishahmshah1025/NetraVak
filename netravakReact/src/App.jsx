import React from 'react'
import FileUploader from "./components/FileUploader.jsx";
import AudioRecorder from "./components/AudioRecorder.jsx";
import CameraCapture from "./components/CamerCapture.jsx";

function App() {

  return (
    <>
      <div >
      <AudioRecorder/>
      <FileUploader/>
      <CameraCapture/>
      </div>
    </>
  )
}

export default App

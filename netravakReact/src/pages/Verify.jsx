import React, { useState } from "react";
import AudioRecorder from "../components/AudioRecorder";
import CameraCapture from "../components/CameraCapture";

const Verify = () => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  return (
    <div>
      <h1>Verify Identity</h1>
      <CameraCapture setImageUrl={setImageUrl} />
      <AudioRecorder setAudioUrl={setAudioUrl} />

      {audioUrl && imageUrl && (
        <button className="bg-blue-500 text-white px-4 py-2 mt-4">
          Submit Verification
        </button>
      )}
    </div>
  );
};

export default Verify;

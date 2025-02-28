import React, { useRef, useState, useEffect } from "react";

const CameraCapture = ({ setImageUrl }) => {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  // Start Camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Capture Image and Turn Off Camera
  const takePicture = () => {
    if (!videoRef.current || !photoRef.current) return;

    const photo = photoRef.current;
    const video = videoRef.current;
    const ctx = photo.getContext("2d");

    // Set canvas size
    photo.width = video.videoWidth || 500;
    photo.height = video.videoHeight || 500;

    // Draw video frame onto canvas
    ctx.drawImage(video, 0, 0, photo.width, photo.height);

    // Convert to Base64 and store it
    const imageData = photo.toDataURL("image/png");
    console.log("Settings");
    setCapturedImage(imageData);
    setImageUrl(imageData); // Send image to parent

    // Stop the camera after capturing
    stopCamera();
  };

  // Auto-play video when stream is available
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => console.error("Video play error:", err));
    }
  }, [stream]);

  return (
    <div>
      {/* Open Camera Button */}
      {!stream && !capturedImage && <button onClick={startCamera}>Open Camera</button>}

      {/* Video Preview */}
      {stream && !capturedImage && (
        <div>
          <video ref={videoRef} style={{ width: "300px", border: "1px solid black" }} autoPlay playsInline />
          <button onClick={takePicture}>Take Selfie</button>
          <button onClick={stopCamera}>Close Camera</button>
        </div>
      )}

      {/* Captured Image */}
      {capturedImage && (
        <div>
          <img src={capturedImage} alt="Captured" style={{ width: "300px", border: "1px solid black" }} />
          <button onClick={() => setCapturedImage(null)}>Clear Image</button>
        </div>
      )}

      {/* Hidden Canvas for Capturing Image */}
      <canvas ref={photoRef} style={{ display: "none" }} />
    </div>
  );
};

export default CameraCapture;

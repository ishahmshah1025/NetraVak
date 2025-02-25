"use client";

import { useState, useRef, useEffect } from "react";

export default function CameraCapture() {
  const [cameraOn, setCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (cameraOn) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [cameraOn]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageData = canvasRef.current.toDataURL("image/png");
    setCapturedImage(imageData);
    stopCamera();
  };

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg bg-gray-900">
      <h2 className="text-lg font-semibold mb-4"> Real-time Camera Capture</h2>

      {capturedImage ? (
        <>
          <img src={capturedImage} alt="Captured" className="w-64 h-48 object-cover rounded-lg" />
          <button
            onClick={() => {
              setCapturedImage(null);
              setCameraOn(true);
            }}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Retake Image
          </button>
        </>
      ) : (
        <>
          {cameraOn && <video ref={videoRef} autoPlay className="w-64 h-48 rounded-lg"></video>}
          <canvas ref={canvasRef} className="hidden" width="640" height="480"></canvas>

          {!cameraOn ? (
            <button
              onClick={() => setCameraOn(true)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg"
            >
               Start Camera
            </button>
          ) : (
            <button
              onClick={captureImage}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
               Capture Image
            </button>
          )}
        </>
      )}
    </div>
  );
}

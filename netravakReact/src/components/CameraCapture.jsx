import axios from "axios";
import { useState, useRef, useEffect } from "react";

export default function VideoCapture() {
  const [cameraOn, setCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [blinkCount, setBlinkCount] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (cameraOn) {
      startCamera();
      const interval = setInterval(() => {
        captureFrame();
      }, 200);
      return () => clearInterval(interval);
    } else {
      stopCamera();
      setBlinkCount(0);
    }
  }, [cameraOn]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // 🛠️ Clear the canvas when restarting the camera
      const context = canvasRef.current.getContext("2d");
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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

  const captureFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      try {
        const response = await axios.post("http://0.0.0.0:8000/detect-blink", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.status === "blink_detected") {
          setBlinkCount(c => c + 1);
        }
      } catch (error) {
        console.error("Error sending frame:", error);
      }
    }, "image/jpeg");
  };
  
  return (
    <div className="flex flex-col items-center p-4 border rounded-lg bg-gray-900">
      <h2 className="text-lg font-semibold mb-4 text-white"> Real-time Camera Capture</h2>

      {capturedImage ? (
        <>
          <img src={capturedImage} alt="Captured" className="w-64 h-48 object-cover rounded-lg" />
          <button
            onClick={() => {
              setCapturedImage(null);
              setCameraOn(true);
              setBlinkCount(0);
              setTimeout(startCamera , 500);
            }}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Retake Image
          </button>
        </>
      ) : (
        <>
          {cameraOn && (
            <>
              <video ref={videoRef} autoPlay className="w-64 h-48 rounded-lg"></video>
              <canvas ref={canvasRef} className="hidden" width="640" height="480"></canvas>
            </>
          )}

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
              className={`mt-4 bg-red-500 text-white px-4 py-2 rounded-lg ${blinkCount < 3 ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={blinkCount < 3}
            >
               Capture Image
            </button>
          )}

          {/* Blink Instruction */}
          {blinkCount < 3 && (
            <p className="text-white font-bold mt-2">Blink your eyes {3 - blinkCount} more times</p>
          )}
        </>
      )}
    </div>
  );
}

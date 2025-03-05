// import React, { useState } from "react";
// import AudioRecorder from "./components/AudioRecorder";
// import CameraCapture from "./components/CameraCapture";
// import FileUploader from "./components/FileUploader";

// const App = () => {
//     const [audioUrl, setAudioUrl] = useState(null);
//     const [imageUrl, setImageUrl] = useState(null);
//     const [file, setFile] = useState(null); 

//     const handleSubmit = async () => {
//         if (!audioUrl || !imageUrl || !file) {
//             alert("Audio, image, and a file are required!");
//             return;
//         }

//         try {
//             // Convert Audio to Blob
//             const audioResponse = await fetch(audioUrl);
//             const audioBlob = await audioResponse.blob();

//             // Convert Image to Blob
//             const imageResponse = await fetch(imageUrl);
//             const imageBlob = await imageResponse.blob();

//             const formData = new FormData();
//             formData.append("audio", audioBlob, "recording.webm");
//             formData.append("image", imageBlob, "selfie.png");
//             formData.append("file", file);  

//             const res = await fetch("http://localhost:5000/upload", {
//                 method: "POST",
//                 body: formData,
//             });

//             if (res.ok) {
//                 alert("Files uploaded successfully!");
//             } else {
//                 alert("Upload failed.");
//             }
//         } catch (error) {
//             console.error("Error uploading files:", error);
//         }
//     };

//     return (
//         <div>
//             <h1>Upload Audio, Image, and File</h1>

            
//             <AudioRecorder setAudioUrl={setAudioUrl} />


//             <CameraCapture setImageUrl={setImageUrl} />


//             <FileUploader setFile={setFile} />


//             {/* {audioUrl && imageUrl && file && ( */}
//                 <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 mt-4">
//                     Submit All Files
//                 </button>
//             {/* )} */}
//         </div>
//     );
// };

// export default App;
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Verify from "./pages/Verify"; 
import Register from "./pages/Register"; 

const App = () => {
  return (
    <Router>
      <div>
        <nav className="flex space-x-4 p-4 bg-gray-200">
          <Link to="/verify" className="text-blue-600">Verify</Link>
          <Link to="/register" className="text-blue-600">Register</Link>
        </nav>

        <Routes>
          <Route path="/verify" element={<Verify />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

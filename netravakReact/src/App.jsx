import React, { useState } from "react";
import AudioRecorderTemp from "./components/AudioRecorderTemp";
import CameraCapture from "./components/CameraCapture";
import FileUploader from "./components/FileUploader";

const App = () => {
    const [audioUrl, setAudioUrl] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [file, setFile] = useState(null);  // Store uploaded file

    const handleSubmit = async () => {
        if (!audioUrl || !imageUrl || !file) {
            alert("Audio, image, and a file are required!");
            return;
        }

        try {
            // Convert Audio to Blob
            const audioResponse = await fetch(audioUrl);
            const audioBlob = await audioResponse.blob();

            // Convert Image to Blob
            const imageResponse = await fetch(imageUrl);
            const imageBlob = await imageResponse.blob();

            const formData = new FormData();
            formData.append("audio", audioBlob, "recording.webm");
            formData.append("image", imageBlob, "selfie.png");
            formData.append("file", file);  

            const res = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                alert("Files uploaded successfully!");
            } else {
                alert("Upload failed.");
            }
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };

    return (
        <div>
            <h1>Upload Audio, Image, and File</h1>

            
            <AudioRecorderTemp setAudioUrl={setAudioUrl} />


            <CameraCapture setImageUrl={setImageUrl} />


            <FileUploader setFile={setFile} />


            {audioUrl && imageUrl && file && (
                <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 mt-4">
                    Submit All Files
                </button>
            )}
        </div>
    );
};

export default App;

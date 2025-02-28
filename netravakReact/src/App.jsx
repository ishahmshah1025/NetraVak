import React, { useState } from "react";
import AudioRecorderTemp from "./components/AudioRecorderTemp";
import CameraCapture from "./components/CameraCapture.jsx";

const App = () => {
    const [audioUrl, setAudioUrl] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const handleSubmit = async () => {
        if (!audioUrl || !imageUrl) {
            alert("Both audio and image are required!");
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

            const res = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                alert("Audio and Image uploaded successfully!");
            } else {
                alert("Upload failed.");
            }
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };

    return (
        <div>
            <AudioRecorderTemp setAudioUrl={setAudioUrl} />
            <CameraCapture setImageUrl={setImageUrl} />

            {audioUrl && imageUrl && (
                <button onClick={handleSubmit}>Submit Both</button>
            )}
        </div>
    );
};

export default App;

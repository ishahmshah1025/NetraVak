import React, { useState } from "react";
import AudioRecorder from "../components/AudioRecorder";
import FileUploader from "../components/FileUploader";

const Register = () => {
    const [name, setName] = useState("");
    const [audioUrl, setAudioUrl] = useState(null);
    const [file, setFile] = useState(null);

    const handleSubmit = async () => {
        // console.log("Hello");
        // console.log("name",name);
        // console.log("audioUrl",audioUrl);
        // console.log("file",file);
        if (!name || !audioUrl || !file) {
            alert("Name, audio, and file are required!");
            return;
        }
        try {
            const audioResponse = await fetch(audioUrl);
            const audioBlob = await audioResponse.blob();

            const formData = new FormData();
            formData.append("name", name);
            formData.append("audio", audioBlob, "recording.webm");
            formData.append("image", file);

            const res = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                alert(`Registration successful! Your UserID: ${data.userID}`);
            } else {
                alert("Upload failed.");
            }
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };

    return (
        <div>
            <h1>Register</h1>

            <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2"
            />

            <AudioRecorder setAudioUrl={setAudioUrl} />
            <FileUploader setFile={setFile} />

            <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 mt-4"
            >
                Submit Registration
            </button>
        </div>
    );
};

export default Register;

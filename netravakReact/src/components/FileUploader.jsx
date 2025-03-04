import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUploader = ({ setFile }) => {  
  const [preview, setPreview] = useState(null); 

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFile(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: "image/*"
  });

  return (
    <div>
      <h2>Upload an Image</h2>
      <div {...getRootProps()} className="p-10 border-2 border-dashed text-center cursor-pointer">
        <input {...getInputProps()} />
        {isDragActive ? "Drop the image here..." : "Drag or click to upload an image"}
      </div>

      
      {preview && (
        <div className="mt-4">
          <img src={preview} alt="Uploaded Preview" className="w-40 h-40 object-cover mt-2" />
        </div>
      )}
    </div>
  );
};

export default FileUploader;

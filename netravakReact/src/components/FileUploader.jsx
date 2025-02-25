"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Check, AlertCircle } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";

export default function FileUploader() {
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setUploadStatus('uploading');
    setErrorMessage('');

    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Uploaded Image:", data.filePath);
      setUploadStatus('success');
    } catch (error) {
      console.error("Upload failed:", error);
      setErrorMessage(error.message || 'File upload failed');
      setUploadStatus('error');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${uploadStatus === 'uploading' ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <Upload className={`w-12 h-12 mx-auto ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {uploadStatus === 'uploading' ? 'Uploading...' : 'Drag & drop an image here, or click to select one'}
            </p>
            <p className="text-xs text-gray-500">
              Maximum file size: 5MB
            </p>
          </div>
        </div>
      </div>

      {uploadStatus === 'success' && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <Check className="w-4 h-4" />
          <AlertDescription>File uploaded successfully!</AlertDescription>
        </Alert>
      )}

      {uploadStatus === 'error' && (
        <Alert className="bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
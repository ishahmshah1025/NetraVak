import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

const FileUploader = ({ onFilesSelected }) => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const fileList = acceptedFiles.map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    }));

    setFiles(fileList);
    onFilesSelected(acceptedFiles); 
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*,audio/*,application/pdf",
    multiple: true,
  });


  useEffect(() => {
    return () => {
      files.forEach((file) => file.preview && URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-500 p-6 rounded-lg text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-gray-700">Drop the files here...</p>
      ) : (
        <p className="text-gray-500">Drag & drop files here, or click to select</p>
      )}
      
      <div className="mt-4 flex flex-wrap gap-4">
        {files.map(({ file, preview }) => (
          <div key={file.name} className="border p-2 rounded text-center">
            {preview ? (
              <img src={preview} alt={file.name} className="h-20 w-20 object-cover rounded" />
            ) : (
              <p className="text-sm">{file.name}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;

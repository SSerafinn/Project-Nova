import React from 'react';
import { useDropzone } from 'react-dropzone';

export default function UploadZone({ onFileAccepted }) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    onDropAccepted: (files) => onFileAccepted(files[0]),
  });

  const fileName = acceptedFiles[0]?.name;

  return (
    <div
      {...getRootProps()}
      className={`
        w-full rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer
        transition-all duration-200 select-none
        ${isDragReject ? 'border-danger bg-danger-light' : ''}
        ${isDragActive && !isDragReject ? 'border-primary bg-primary-light scale-[1.01]' : ''}
        ${!isDragActive && !isDragReject ? 'border-border hover:border-primary hover:bg-primary-light/30' : ''}
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-3">
        {isDragReject ? (
          <>
            <span className="text-4xl">❌</span>
            <p className="font-bold text-danger">Only PDF files are supported!</p>
          </>
        ) : fileName ? (
          <>
            <span className="text-4xl">✅</span>
            <p className="font-bold text-primary">{fileName}</p>
            <p className="text-sm text-muted">Click or drop to replace</p>
          </>
        ) : isDragActive ? (
          <>
            <span className="text-4xl">📂</span>
            <p className="font-bold text-primary">Drop it here!</p>
          </>
        ) : (
          <>
            <span className="text-4xl">📄</span>
            <p className="font-bold text-[#3C3C3C]">Drop your PDF here</p>
            <p className="text-sm text-muted">or click to browse — max 10 MB</p>
          </>
        )}
      </div>
    </div>
  );
}

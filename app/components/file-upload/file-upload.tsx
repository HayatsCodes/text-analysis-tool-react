"use client";

import React, { useRef, useState, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface UploadedFile {
  name: string;
  size: number;
}

export interface FileUploadProps {
  onUpload?: () => void;
  onSelectColumn?: () => void;
}

export function FileUpload({ onUpload, onSelectColumn }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv') && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && !file.name.endsWith('.xlsx')) {
        toast.error('Please upload a CSV or XLSX file');
        if (inputRef.current) inputRef.current.value = '';
        return;
      }
      setUploadedFile({ name: file.name, size: file.size });
      setIsUploaded(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv') && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && !file.name.endsWith('.xlsx')) {
        toast.error('Please upload a CSV or XLSX file');
        return;
      }
      setUploadedFile({ name: file.name, size: file.size });
      setIsUploaded(false);
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleRemoveFile() {
    setUploadedFile(null);
    setIsUploaded(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleUpload() {
    if (!uploadedFile || !inputRef.current?.files?.[0]) return;
    
    setIsUploading(true);
    const uploadPromise = new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append('file', inputRef.current.files[0]);

        const response = await fetch('https://analysis-app-ruud.onrender.com/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        setIsUploaded(true);
        if (onUpload) onUpload();
        resolve(data);
      } catch (error) {
        console.error('Upload error:', error);
        setIsUploaded(false);
        reject(error);
      } finally {
        setIsUploading(false);
      }
    });

    toast.promise(uploadPromise, {
      loading: 'Uploading file...',
      success: 'File uploaded successfully!',
      error: 'Failed to upload file. Please try again.',
    });
  }

  function handleSelectColumn() {
    if (isUploaded && onSelectColumn) onSelectColumn();
  }

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center w-full h-64 transition-colors duration-200 ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-blue-300 bg-white"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        tabIndex={0}
        role="button"
        aria-label="Upload file"
      >
        <Image
          src="/file.svg"
          alt="File icon"
          width={48}
          height={48}
          className="mb-4"
          priority
        />
        {!uploadedFile ? (
          <>
            <span className="font-semibold text-lg">Drag & Drop your CSV or XLSX file</span>
            <span className="text-xs text-gray-500 mt-2">
              or <span className="text-blue-600 underline cursor-pointer">browse files</span> on your computer
            </span>
            <span className="text-xs text-gray-500 mt-1">Only CSV or XLSX files are accepted</span>
          </>
        ) : (
          <>
            <span className="text-base text-gray-700 mt-2">{uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)}kb)</span>
            {isUploaded ? (
              <span className="ml-2 text-green-600" title="Uploaded">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 inline">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </span>
            ) : (
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                aria-label="Remove file"
                onClick={e => { e.stopPropagation(); handleRemoveFile(); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 inline">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          aria-label="File input"
        />
      </div>
      <div className="flex gap-4 mt-6 w-full justify-center">
        <button
          className={`rounded px-6 py-2 font-semibold shadow transition-colors ${
            isUploaded
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : uploadedFile
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-700 cursor-not-allowed"
          }`}
          disabled={!uploadedFile || isUploaded || isUploading}
          onClick={handleUpload}
        >
          {isUploading ? "Uploading..." : isUploaded ? "Uploaded" : "Upload"}
        </button>
        <button
          className={`rounded px-6 py-2 font-semibold shadow transition-colors ${
            isUploaded
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-700 cursor-not-allowed"
          }`}
          disabled={!isUploaded}
          onClick={handleSelectColumn}
        >
          Select Column
        </button>
      </div>
    </div>
  );
} 
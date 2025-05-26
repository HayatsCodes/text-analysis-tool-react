"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface FileData {
  filename: string;
  columns: string[];
  file: File | null; // Can be null if loaded from localStorage
}

interface FileContextType {
  fileData: FileData | null;
  setFileData: (data: FileData | null) => void;
  isLoading: boolean;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
  const [fileData, setFileDataState] = useState<FileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedFilename = localStorage.getItem("fileName");
      const storedColumns = localStorage.getItem("columns");

      if (storedFilename && storedColumns) {
        setFileDataState({
          filename: storedFilename,
          columns: JSON.parse(storedColumns),
          file: null, // File object cannot be stored in localStorage
        });
      }
    } catch (error) {
      console.error("Failed to load file data from localStorage", error);
      // Optionally clear localStorage if data is corrupted
      // localStorage.removeItem("fileName");
      // localStorage.removeItem("columns");
    }
    setIsLoading(false);
  }, []);

  const setFileData = (data: FileData | null) => {
    setFileDataState(data);
    if (data && data.filename && data.columns) {
      try {
        localStorage.setItem("fileName", data.filename);
        localStorage.setItem("columns", JSON.stringify(data.columns));
      } catch (error) {
        console.error("Failed to save file data to localStorage", error);
      }
    } else {
      localStorage.removeItem("fileName");
      localStorage.removeItem("columns");
    }
  };

  return (
    <FileContext.Provider value={{ fileData, setFileData, isLoading }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFile() {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error("useFile must be used within a FileProvider");
  }
  return context;
}
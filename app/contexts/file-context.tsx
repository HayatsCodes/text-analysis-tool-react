"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface FileData {
  filename: string;
  columns: string[];
  file: File;
}

interface FileContextType {
  fileData: FileData | null;
  setFileData: (data: FileData | null) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
  const [fileData, setFileData] = useState<FileData | null>(null);

  return (
    <FileContext.Provider value={{ fileData, setFileData }}>
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
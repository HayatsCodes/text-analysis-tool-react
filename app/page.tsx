"use client";

import React, { useState } from "react";
import { FileUpload } from "./components/file-upload/file-upload";
import { SelectColumn } from "./components/select-column/select-column";
import { useSidebarState } from "./components/sidebar-layout/sidebar-state-context";

export default function Home() {
  const [step, setStep] = useState<1 | 2>(1);
  const { setCurrentChild } = useSidebarState();

  function handleUploadComplete() {
    setCurrentChild("upload");
  }

  function handleSelectColumn() {
    setCurrentChild("select-column");
    setStep(2);
  }



  return (
    <div className="w-full h-full flex flex-col items-center justify-center pt-16 md:pt-0">
      {step === 1 && (
        <div className="w-full flex flex-col items-center">
          <FileUpload
            onUpload={handleUploadComplete}
            onSelectColumn={handleSelectColumn}
          />
        </div>
      )}
      {step === 2 && (
        <SelectColumn />
      )}
    </div>
  );
}

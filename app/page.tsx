"use client";

import React, { useState } from "react";
import { FileUpload } from "./components/file-upload/file-upload";
import { SelectColumn } from "./components/select-column/select-column";
import { useSidebarState } from "./components/sidebar-layout/sidebar-state-context";

const columns = ["Title", "Detail", "Author", "Date", "Category", "Views"];

export default function Home() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const { setCurrentChild } = useSidebarState();

  function handleUploadComplete() {
    setCurrentChild("upload");
  }

  function handleSelectColumn() {
    setCurrentChild("select-column");
    setStep(2);
  }

  function handleColumnSelect(col: string) {
    setSelectedColumns(cols =>
      cols.includes(col) ? cols.filter(c => c !== col) : [...cols, col]
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {step === 1 && (
        <div className="w-full flex flex-col items-center">
          <FileUpload
            onUpload={handleUploadComplete}
            onSelectColumn={handleSelectColumn}
          />
        </div>
      )}
      {step === 2 && (
        <SelectColumn
          columns={columns}
          selectedColumns={selectedColumns}
          onChange={handleColumnSelect}
          onNext={() => {}}
        />
      )}
    </div>
  );
}

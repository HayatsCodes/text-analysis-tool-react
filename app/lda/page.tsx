"use client";

import React, { useState, useEffect } from "react";
import { LDAForm } from "../components/lda-form/lda-form";
import { LDAAnalysisViewTabs } from "../components/lda-analysis-view/lda-analysis-view";
import { useSidebarState } from "../components/sidebar-layout/sidebar-state-context";
import { LDAResponse } from "../types/lda";
import { Button } from "@/components/ui/button";

export default function LDAPage() {
  const [showForm, setShowForm] = useState(true);
  const [ldaData, setLdaData] = useState<LDAResponse | null>(null);
  const { setCurrentSection, setCurrentChild } = useSidebarState();

  useEffect(() => {
    setCurrentSection("analysis");
    setCurrentChild("lda");
  }, [setCurrentSection, setCurrentChild]);

  // Optional: For debugging - Log ldaData whenever it changes
  useEffect(() => {
    console.log("LDAPage: ldaData updated", ldaData);
  }, [ldaData]);

  function handleLdaProcessed(data: LDAResponse) {
    setLdaData(data); // Initial processing sets the whole data
    setShowForm(false);
  }

  function handleKeywordsUpdated(updatedFields: Partial<LDAResponse>) {
    setLdaData(prevLdaData => {
      if (!prevLdaData) return updatedFields as LDAResponse; // Should not happen if called after initial processing
      return { ...prevLdaData, ...updatedFields };
    });
  }
  
  function handleReset() {
    setLdaData(null);
    setShowForm(true);
  }

  return (
    <div className="w-full flex flex-col items-center pb-8 px-4 sm:px-6 lg:px-8">
      {showForm && <LDAForm onProcessed={handleLdaProcessed} />}
      {!showForm && ldaData && (
        <div className="w-full max-w-5xl flex flex-col items-start">
          {/* <Button onClick={handleReset} variant="outline" className="mb-4">
            New Analysis (Back to Form)
          </Button> */}
          <LDAAnalysisViewTabs ldaResponse={ldaData} onKeywordsUpdated={handleKeywordsUpdated} />
        </div>
      )}
    </div>
  );
} 
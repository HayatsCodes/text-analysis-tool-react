"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { LDAForm } from "../components/lda-form/lda-form";
import { LDAAnalysisViewTabs } from "../components/lda-analysis-view/lda-analysis-view";
import { useSidebarState } from "../components/sidebar-layout/sidebar-state-context";
import { LDAResponse } from "../types/lda";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function LDAPage() {
  const [showForm, setShowForm] = useState(true);
  const [ldaData, setLdaData] = useState<LDAResponse | null>(null);
  const { setCurrentSection, setCurrentChild } = useSidebarState();
  const router = useRouter();

  useEffect(() => {
    setCurrentSection("analysis");
    setCurrentChild("lda");
  }, [setCurrentSection, setCurrentChild]);

  // Optional: For debugging - Log ldaData whenever it changes
  useEffect(() => {
    console.log("LDAPage: ldaData updated", ldaData);
  }, [ldaData]);

  function handleLdaProcessed(data: LDAResponse) {
    setLdaData(data);
    setShowForm(false);
  }

  function handleKeywordsUpdated(updatedFields: Partial<LDAResponse>) {
    setLdaData(prevLdaData => {
      if (!prevLdaData) return updatedFields as LDAResponse;
      return { ...prevLdaData, ...updatedFields };
    });
  }
  
  function handleReset() {
    setLdaData(null);
    setShowForm(true);
  }

  // Determine Back Button props based on state
  let backButtonProps: { text: string; onClick: () => void; visible: boolean } = {
    text: "",
    onClick: () => {},
    visible: true,
  };

  if (!showForm && ldaData) { // Results/Tabs view
    backButtonProps = {
      text: "New LDA Analysis (Back to Form)",
      onClick: handleReset,
      visible: true,
    };
  } else if (showForm) { // Form view
    backButtonProps = {
      text: "Back to word frequency analysis",
      onClick: () => router.push('/analysis'), 
      visible: true,
    };
  } else { // No data and not showing form (initial state or after reset before new data)
    backButtonProps.visible = false; // Or a different default back action, e.g. router.back()
  }

  return (
    <div className="w-full flex flex-col items-center pb-8 px-4 sm:px-6 lg:px-8">
      {/* Back Button Area */} 
      {backButtonProps.visible && (
          <div className="w-full max-w-5xl mt-4 mb-4 sm:mb-6 flex justify-start">
            <Button 
              variant="outline"
              onClick={backButtonProps.onClick}
              className="text-blue-600 border-blue-500 hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backButtonProps.text}
            </Button>
          </div>
      )}

      {showForm && <LDAForm onProcessed={handleLdaProcessed} />}
      {!showForm && ldaData && (
        <div className="w-full max-w-5xl flex flex-col items-start">
          <LDAAnalysisViewTabs ldaResponse={ldaData} onKeywordsUpdated={handleKeywordsUpdated} />
        </div>
      )}
    </div>
  );
} 
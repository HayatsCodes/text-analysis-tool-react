"use client";

import React, { useState, useEffect } from "react";
import { AnalysisResult } from "../components/analysis-result/analysis-result";
import { useSidebarState } from "../components/sidebar-layout/sidebar-state-context";
import { WordFrequencyForm } from "../components/word-frequency/word-frequency";

export default function AnalysisPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const { setCurrentSection, setCurrentChild } = useSidebarState();

  useEffect(() => {
    setCurrentSection("analysis");
    setCurrentChild("word_frequency");
  }, [setCurrentSection, setCurrentChild]);

  function handleAnalysisComplete(result: any) {
    setAnalysisData(result);
    setStep(2);
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {step === 1 && <WordFrequencyForm onAnalyzed={handleAnalysisComplete} />}
      {step === 2 && <AnalysisResult analysisData={analysisData} onNext={() => {}} />}
    </div>
  );
} 
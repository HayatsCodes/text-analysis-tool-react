"use client";

import React, { useState, useEffect } from "react";
import { AnalysisResult } from "../components/analysis-result/analysis-result";
import { LDAKeywordEditor } from "../components/lda-keyword-editor/lda-keyword-editor";
import Link from "next/link";
import { useSidebarState } from "../components/sidebar-layout/sidebar-state-context";
import { WordFrequencyForm } from "../components/word-frequency/word-frequency";

export default function AnalysisPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const { setCurrentSection, setCurrentChild } = useSidebarState();

  useEffect(() => {
    setCurrentSection("analysis");
    setCurrentChild("word_frequency");
  }, [setCurrentSection, setCurrentChild]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {step === 1 && <WordFrequencyForm onAnalyzed={() => setStep(2)} />}
      {step === 2 && <AnalysisResult onNext={() => {}} />}
    </div>
  );
} 
"use client";

import React, { useState, useEffect } from "react";
import { LDAForm } from "../components/lda-form/lda-form";
import { LDAKeywordEditor } from "../components/lda-keyword-editor/lda-keyword-editor";
import { LDATabs } from "../components/lda-tabs/lda-tabs";
import { useSidebarState } from "../components/sidebar-layout/sidebar-state-context";
import { LDAResponse } from "../types/lda";

type Step = 1 | 2 | 3;

export default function LDAPage() {
  const [step, setStep] = useState<Step>(1);
  const [ldaData, setLdaData] = useState<LDAResponse | null>(null);
  const { setCurrentSection, setCurrentChild } = useSidebarState();

  useEffect(() => {
    setCurrentSection("analysis");
    setCurrentChild("lda");
  }, [setCurrentSection, setCurrentChild]);

  function handleLdaProcessed(data: LDAResponse) {
    setLdaData(data);
    setStep(2);
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-8">
      {step === 1 && <LDAForm onProcessed={handleLdaProcessed} />}
      {step === 2 && ldaData && <LDAKeywordEditor ldaResponse={ldaData} onNext={() => setStep(3)} />}
      {step === 3 && <LDATabs ldaResponse={ldaData} />}
    </div>
  );
} 
"use client";

import React, { useState, useEffect } from "react";
import { LDAForm } from "../components/lda-form/lda-form";
import { LDAKeywordEditor } from "../components/lda-keyword-editor/lda-keyword-editor";
import { LDATabs } from "../components/lda-tabs/lda-tabs";
import { useSidebarState } from "../components/sidebar-layout/sidebar-state-context";

type Step = 1 | 2 | 3;

export default function LDAPage() {
  const [step, setStep] = useState<Step>(1);
  const { setCurrentSection, setCurrentChild } = useSidebarState();

  useEffect(() => {
    setCurrentSection("analysis");
    setCurrentChild("lda");
  }, [setCurrentSection, setCurrentChild]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {step === 1 && <LDAForm onProcessed={() => setStep(2)} />}
      {step === 2 && <LDAKeywordEditor onNext={() => setStep(3)} />}
      {step === 3 && <LDATabs />}
    </div>
  );
} 
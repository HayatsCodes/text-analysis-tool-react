"use client";

import React, { useState, useEffect } from "react";
import { AnalysisResult } from "../components/analysis-result/analysis-result";
import { LDAKeywordEditor } from "../components/lda-keyword-editor/lda-keyword-editor";
import Link from "next/link";
import { useSidebarState } from "../components/sidebar-layout/sidebar-state-context";

export default function AnalysisPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const { setCurrentSection, setCurrentChild } = useSidebarState();

  useEffect(() => {
    setCurrentSection("analysis");
    setCurrentChild("word_frequency");
  }, [setCurrentSection, setCurrentChild]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {step === 1 && <AnalysisResult onNext={() => setStep(2)} />}
      {step === 2 && (
        <>
          <LDAKeywordEditor onNext={() => {}} />
          <div className="flex justify-center mt-8">
            <Link href="/lda">
              <button className="bg-blue-600 text-white rounded-full px-8 py-2 font-semibold shadow hover:bg-blue-700 transition-colors">
                Continue
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
} 
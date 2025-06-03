"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { AnalysisResult } from "../components/analysis-result/analysis-result";
import { useSidebarState } from "../components/sidebar-layout/sidebar-state-context";
import { WordFrequencyForm } from "../components/word-frequency/word-frequency";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AnalysisPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const { setCurrentSection, setCurrentChild } = useSidebarState();
  const router = useRouter();

  useEffect(() => {
    setCurrentSection("analysis");
    setCurrentChild("word_frequency");
  }, [setCurrentSection, setCurrentChild]);

  function handleAnalysisComplete(result: any) {
    setAnalysisData(result);
    setStep(2);
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full max-w-xl mt-4 mb-4 sm:mb-6 flex justify-start px-4 sm:px-0">
        <Button 
          variant="outline"
          onClick={() => router.push('/preprocessing')}
          className="text-blue-600 border-blue-500 hover:bg-blue-50 hover:text-blue-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Preprocessing
        </Button>
      </div>

      <div className="w-full flex flex-col items-center justify-center">
        {step === 1 && <WordFrequencyForm onAnalyzed={handleAnalysisComplete} />}
        {step === 2 && <AnalysisResult analysisData={analysisData} onNext={() => {}} />}
      </div>
    </div>
  );
} 
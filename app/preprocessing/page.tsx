"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PreprocessingForm } from "../components/preprocessing-form/preprocessing-form";
import Link from "next/link";
import { useSidebarState } from "../components/sidebar-layout/sidebar-state-context";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const languages = ["Korean", "English"];
const analyzers = ["Hannanum", "Komoran"];
const analyzerSettings = ["Adjective", "Noun"];

function PreprocessingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const columnsParam = searchParams.get("columns");
  const selectedColumns = columnsParam ? columnsParam.split(",") : [];
  const { setCurrentSection, setCurrentChild } = useSidebarState();

  const [language, setLanguage] = useState<"korean" | "english">("korean");
  const [column, setColumn] = useState("");
  const [analyzer, setAnalyzer] = useState("");
  const [analyzerSetting, setAnalyzerSetting] = useState("adjective");
  const [wordLength, setWordLength] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    setCurrentSection("preprocessing");
    setCurrentChild(null);
  }, [setCurrentSection, setCurrentChild]);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full max-w-xl mt-4 mb-4 sm:mb-6 flex justify-start px-4 sm:px-0">
        <Button 
          variant="outline"
          onClick={() => router.push('/')}
          className="text-blue-600 border-blue-500 hover:bg-blue-50 hover:text-blue-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to upload
        </Button>
      </div>

      <div className="w-full max-w-xl px-4 sm:px-0 pb-8">
        <PreprocessingForm
          language={language}
          setLanguage={setLanguage}
          column={column}
          setColumn={setColumn}
          analyzer={analyzer}
          setAnalyzer={setAnalyzer}
          analyzerSetting={analyzerSetting}
          setAnalyzerSetting={setAnalyzerSetting}
          wordLength={wordLength}
          setWordLength={setWordLength}
          fileName={fileName}
          setFileName={setFileName}
          selectedColumns={selectedColumns}
          onProcess={() => {}}
        />
      </div>
    </div>
  );
}

export default function PreprocessingPage() {
  return (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>}>
      <PreprocessingPageContent />
    </Suspense>
  );
} 
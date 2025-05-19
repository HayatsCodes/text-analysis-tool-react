"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PreprocessingForm } from "../components/preprocessing-form/preprocessing-form";
import Link from "next/link";
import { useSidebarState } from "../components/sidebar-layout/sidebar-state-context";

const languages = ["Korean", "English"];
const analyzers = ["Hannanum", "Komoran"];
const analyzerSettings = ["Adjective", "Noun"];

export default function PreprocessingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const columnsParam = searchParams.get("columns");
  const selectedColumns = columnsParam ? columnsParam.split(",") : [];
  const { setCurrentSection, setCurrentChild } = useSidebarState();

  const [language, setLanguage] = useState(languages[0]);
  const [column, setColumn] = useState("");
  const [analyzer, setAnalyzer] = useState(analyzers[0]);
  const [analyzerSetting, setAnalyzerSetting] = useState(analyzerSettings[0]);
  const [wordLength, setWordLength] = useState("");
  const [fileName, setFileName] = useState("");
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    setCurrentSection("preprocessing");
    setCurrentChild(null);
  }, [setCurrentSection, setCurrentChild]);

  function handleProcess() {
    setProcessed(true);
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
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
        languages={languages}
        analyzers={analyzers}
        analyzerSettings={analyzerSettings}
        onProcess={handleProcess}
      />
      {processed && (
        <div className="flex justify-center mt-8">
          <Link href="/analysis">
            <button className="bg-blue-600 text-white rounded-full px-8 py-2 font-semibold shadow hover:bg-blue-700 transition-colors">
              Continue
            </button>
          </Link>
        </div>
      )}
    </div>
  );
} 
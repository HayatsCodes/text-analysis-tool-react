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
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-xl">
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
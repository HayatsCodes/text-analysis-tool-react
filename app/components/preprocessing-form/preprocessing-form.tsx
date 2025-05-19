import React from "react";

export interface PreprocessingFormProps {
  language: string;
  setLanguage: (v: string) => void;
  column: string;
  setColumn: (v: string) => void;
  analyzer: string;
  setAnalyzer: (v: string) => void;
  analyzerSetting: string;
  setAnalyzerSetting: (v: string) => void;
  wordLength: string;
  setWordLength: (v: string) => void;
  fileName: string;
  setFileName: (v: string) => void;
  selectedColumns: string[];
  languages: string[];
  analyzers: string[];
  analyzerSettings: string[];
  onProcess: () => void;
}

export function PreprocessingForm({
  language, setLanguage, column, setColumn, analyzer, setAnalyzer, analyzerSetting, setAnalyzerSetting, wordLength, setWordLength, fileName, setFileName, selectedColumns, languages, analyzers, analyzerSettings, onProcess
}: PreprocessingFormProps) {
  return (
    <div className="flex flex-col items-center gap-8 mt-12 w-full max-w-3xl">
      <div className="mb-8 text-xl font-semibold">Data Preprocessing</div>
      {/* Language & Column */}
      <div className="border rounded-lg p-8 w-full bg-white shadow-sm">
        <div className="mb-4 font-medium text-lg">Select Language</div>
        <select
          className="border rounded-lg px-4 py-2 w-full mb-6 text-lg"
          value={language}
          onChange={e => setLanguage(e.target.value)}
        >
          {languages.map(l => <option key={l}>{l}</option>)}
        </select>
        <div className="mb-4 font-medium text-lg">Select Column</div>
        <select
          className="border rounded-lg px-4 py-2 w-full text-lg"
          value={column}
          onChange={e => setColumn(e.target.value)}
        >
          <option value="">Process</option>
          {selectedColumns.map(col => <option key={col}>{col}</option>)}
        </select>
      </div>
      {/* Analyzer */}
      <div className="border rounded-lg p-8 w-full bg-white shadow-sm">
        <div className="mb-4 font-medium text-lg">Morphological Analyzer</div>
        <select
          className="border rounded-lg px-4 py-2 w-full mb-6 text-lg"
          value={analyzer}
          onChange={e => setAnalyzer(e.target.value)}
        >
          {analyzers.map(a => <option key={a}>{a}</option>)}
        </select>
        <div className="mb-4 font-medium text-lg">Morphological Analyzer Settings</div>
        <select
          className="border rounded-lg px-4 py-2 w-full mb-6 text-lg"
          value={analyzerSetting}
          onChange={e => setAnalyzerSetting(e.target.value)}
        >
          {analyzerSettings.map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="mb-4 font-medium text-lg">Word Length</div>
        <input
          className="border rounded-lg px-4 py-2 w-full text-lg"
          value={wordLength}
          onChange={e => setWordLength(e.target.value)}
          placeholder="2, 3"
        />
      </div>
      {/* File Name */}
      <div className="border rounded-lg p-8 w-full bg-white shadow-sm">
        <div className="mb-4 font-medium text-lg">Set file name</div>
        <input
          className="border rounded-lg px-4 py-2 w-full text-lg"
          value={fileName}
          onChange={e => setFileName(e.target.value)}
          placeholder="Process File"
        />
      </div>
      {/* Actions */}
      <div className="flex gap-4 w-full justify-center">
        <button
          className="bg-blue-600 text-white rounded-full px-8 py-3 font-semibold shadow hover:bg-blue-700 transition-colors text-lg"
          onClick={onProcess}
        >
          Process File
        </button>
      </div>
    </div>
  );
} 
import React from "react";

export interface AnalysisResultProps {
  onNext: () => void;
}

export function AnalysisResult({ onNext }: AnalysisResultProps) {
  return (
    <div className="flex flex-col items-center gap-8 mt-12 w-full max-w-xl">
      <div className="text-base font-semibold mb-4 text-left w-full" style={{ maxWidth: 400 }}>Analysis Result</div>
      <div className="border rounded-lg p-8 flex flex-col items-center w-full max-w-md">
        <div className="border rounded w-full h-64 p-2 flex flex-col">
          <div className="text-xs font-medium mb-1">Word Cloud</div>
          <div className="flex-1 border rounded bg-white" />
        </div>
      </div>
      <button
        className="bg-blue-600 text-white rounded-full px-8 py-2 font-semibold shadow hover:bg-blue-700 transition-colors"
        onClick={onNext}
      >
        Next
      </button>
    </div>
  );
} 
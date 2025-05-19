import React from "react";
import Link from "next/link";

export interface SelectColumnProps {
  columns: string[];
  selectedColumns: string[];
  onChange: (col: string) => void;
  onNext: () => void;
}

export function SelectColumn({ columns, selectedColumns, onChange, onNext }: SelectColumnProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-3xl">
      <div className="mb-8 text-xl font-semibold">Select Column to Analyze</div>
      <div className="border rounded-lg p-12 flex flex-col items-center w-full bg-white shadow-sm">
        <div className="grid grid-cols-3 gap-8 mb-8 w-full">
          {columns.map(col => (
            <label key={col} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={selectedColumns.includes(col)}
                onChange={() => onChange(col)}
                className="w-5 h-5"
              />
              <span className="text-lg">{col}</span>
            </label>
          ))}
        </div>
        <Link 
          href={{ 
            pathname: "/preprocessing", 
            query: { columns: selectedColumns.join(",") } 
          }}
          className={`rounded-full px-8 py-3 font-semibold shadow transition-colors text-lg ${
            selectedColumns.length === 0 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          onClick={onNext}
        >
          Start Analysis
        </Link>
      </div>
    </div>
  );
} 
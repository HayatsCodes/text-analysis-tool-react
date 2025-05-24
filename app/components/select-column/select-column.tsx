"use client";

import { useState } from "react";
import { useFile } from "../../contexts/file-context";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export function SelectColumn() {
  const { fileData } = useFile();
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const router = useRouter();

  if (!fileData?.columns) {
    return (
      <Card className="p-6 text-center text-gray-500">
        No file data available. Please upload a file first.
      </Card>
    );
  }

  function handleColumnSelect(column: string) {
    setSelectedColumns(prev => 
      prev.includes(column) 
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  }

  function handleNext() {
    router.push(`/preprocessing?columns=${selectedColumns.join(',')}`);
  }

  return (
    <Card className="p-4 sm:p-6 w-full max-w-2xl">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center sm:text-left">Select Columns to Analyze</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {fileData.columns.map((column) => (
          <div
            key={column}
            onClick={() => handleColumnSelect(column)}
            className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
          >
            <Checkbox
              id={column}
              checked={selectedColumns.includes(column)}
              onCheckedChange={() => handleColumnSelect(column)}
            />
            <label
              htmlFor={column}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {column}
            </label>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Button
          onClick={handleNext}
          disabled={selectedColumns.length === 0}
          className="bg-blue-600 hover:bg-blue-700 rounded-[45px] px-6 py-2 cursor-pointer"
        >
          Start Analysis
        </Button>
      </div>
    </Card>
  );
} 
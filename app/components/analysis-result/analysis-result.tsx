import React from "react";
import { Button } from "@/components/ui/button";
import { Download, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export interface AnalysisResultProps {
  analysisData: any; // Can be more specific based on actual API response
  onNext: () => void;
}

export function AnalysisResult({ analysisData, onNext }: AnalysisResultProps) {
  const router = useRouter();

  const handleDownload = () => {
    // Mock download functionality
    console.log('Downloading word cloud...');
  };

  const handleProceed = () => {
    router.push('/lda');
  };

  return (
    <div className="flex flex-col items-center gap-8 mt-12 w-full max-w-xl">
      <div className="text-base font-semibold mb-4 text-left w-full" style={{ maxWidth: 400 }}>Analysis Result</div>
      <div className="border rounded-lg p-8 flex flex-col items-center w-full max-w-md">
        <div className="border rounded w-full h-64 p-2 flex flex-col">
          <div className="text-xs font-medium mb-1">Word Cloud</div>
          <div className="flex-1 border rounded bg-white" />
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-2 text-sm min-w-[120px]"
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button
          onClick={handleProceed}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-2 text-sm min-w-[120px]"
        >
          Proceed
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 
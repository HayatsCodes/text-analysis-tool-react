import React from "react";
import { Button } from "@/components/ui/button";
import { Download, ArrowRight, ImageOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export interface AnalysisResultProps {
  analysisData: {
    wordcloud_url?: string;
  } | null;
  onNext: () => void;
}

export function AnalysisResult({ analysisData, onNext }: AnalysisResultProps) {
  const router = useRouter();
  const wordCloudUrl = analysisData?.wordcloud_url?.replace(/^http:\/\//i, 'https://');

  const handleDownload = () => {
    if (wordCloudUrl) {
      const link = document.createElement('a');
      try {
        const url = new URL(wordCloudUrl);
        url.searchParams.set('download', 'true');
        link.href = url.toString();
      } catch (error) {
        console.error("Invalid URL:", wordCloudUrl, error);
        // Fallback to original behavior or handle error as appropriate
        // For now, let's try the old method as a fallback
        const downloadUrl = wordCloudUrl.includes('?') ? wordCloudUrl + '&download=true' : wordCloudUrl + '?download=true';
        link.href = downloadUrl;
      }
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log('No word cloud URL available for download.');
    }
  };

  const handleProceed = () => {
    router.push('/lda');
  };

  return (
    <div className="flex flex-col items-center gap-8 mt-4 w-full max-w-xl px-4">
      {/* <h2 className="text-2xl font-semibold text-gray-800 self-start">Analysis Result</h2> */}
      
      <div className="w-full bg-white shadow-xl rounded-lg p-6 flex flex-col items-center border-black border-2">
        <h3 className="text-lg font-medium text-gray-700 mb-4 self-start">Word Cloud</h3>
        {/* <div className="w-full aspect-[16/10] border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden"> */}
          {wordCloudUrl ? (
            <Image
              src={wordCloudUrl}
              alt="Generated Word Cloud"
              width={700}
              height={437}
              className="object-contain"
              priority
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <ImageOff className="w-16 h-16 mb-2" />
              <p className="text-sm">Word cloud image not available.</p>
            </div>
          )}
        </div>
      {/* </div> */}

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4 w-full">
        <Button
          onClick={handleDownload}
          disabled={!wordCloudUrl}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full px-10 py-3 text-base font-semibold shadow-md transition-all hover:shadow-lg disabled:opacity-50 w-full sm:w-auto min-w-[180px]"
        >
          <Download className="mr-2 h-5 w-5" />
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
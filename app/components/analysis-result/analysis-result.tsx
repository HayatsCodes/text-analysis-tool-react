import React from "react";
import { Button } from "@/components/ui/button";
import { Download, ArrowRight, ImageOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface AnalysisResultProps {
  analysisData: {
    wordcloud_url?: string;
    word_data?: Array<{
      frequency: number;
      word: string;
      ratio?: string;
    }>;
    download_url?: string; // URL for downloading the frequency analysis CSV data
  } | null;
  onNext: () => void;
}

export function AnalysisResult({ analysisData, onNext }: AnalysisResultProps) {
  const router = useRouter();
  const wordCloudUrl = analysisData?.wordcloud_url?.replace(/^http:\/\//i, 'https://');

  const handleDownloadWordCloud = () => {
    if (wordCloudUrl) {
      const link = document.createElement('a');
      try {
        const url = new URL(wordCloudUrl);
        url.searchParams.set('download', 'true');
        link.href = url.toString();
      } catch (error) {
        console.error("Invalid URL:", wordCloudUrl, error);
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

  const handleDownloadFrequencyCSV = () => {
    if (analysisData?.download_url) {
      const link = document.createElement('a');
      link.href = analysisData.download_url;
      link.setAttribute('download', 'frequency_analysis.csv'); // Suggests a filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log('No CSV download URL available.');
    }
  };

  const handleProceed = () => {
    router.push('/lda');
  };

  const wordDataForTable = analysisData?.word_data?.map((item, index) => ({
    ...item,
    ranking: index + 1,
    ratioDisplay: typeof item.ratio === 'number' ? `${(item.ratio * 100).toFixed(2)}%` :
                  typeof item.ratio === 'string' ? `${parseFloat(item.ratio).toFixed(2)}%` : "0.00%",
  })) || [];

  return (
    <div className="flex flex-col items-center mt-12 w-full max-w-4xl px-2 sm:px-4">
      <Tabs defaultValue="frequency" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="frequency" className="cursor-pointer">Frequency analysis results</TabsTrigger>
          <TabsTrigger value="wordcloud" className="cursor-pointer">Word Cloud</TabsTrigger>
        </TabsList>
        <TabsContent value="frequency">
          <div className="w-full bg-white shadow-xl rounded-lg p-4 sm:p-6 flex flex-col items-center border mt-4">
            <Button
              onClick={handleDownloadFrequencyCSV}
              disabled={!analysisData?.download_url || !analysisData.word_data || analysisData.word_data.length === 0}
              className="bg-slate-700 hover:bg-slate-800 text-white rounded-md px-4 py-2 text-sm font-semibold shadow-md transition-all hover:shadow-lg disabled:opacity-50 self-start mb-4"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Frequency Analysis CSV File
            </Button>
            <div className="w-full overflow-x-auto max-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ranking</TableHead>
                    <TableHead>word</TableHead>
                    <TableHead className="text-right">Frequency</TableHead>
                    <TableHead className="text-right w-[120px]">ratio(%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wordDataForTable.length > 0 ? (
                    wordDataForTable.map((item) => (
                      <TableRow key={item.ranking}>
                        <TableCell className="font-medium">{item.ranking}</TableCell>
                        <TableCell>{item.word}</TableCell>
                        <TableCell className="text-right">{item.frequency}</TableCell>
                        <TableCell className="text-right">{item.ratioDisplay}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        No frequency data available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="wordcloud">
          <div className="w-full bg-white shadow-xl rounded-lg p-4 sm:p-6 flex flex-col items-center border mt-4">
            <Button
              onClick={handleDownloadWordCloud}
              disabled={!wordCloudUrl}
              className="bg-slate-700 hover:bg-slate-800 text-white rounded-md px-4 py-2 text-sm font-semibold shadow-md transition-all hover:shadow-lg disabled:opacity-50 self-start mb-4"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Word Cloud
            </Button>
            {wordCloudUrl ? (
              <Image
                src={wordCloudUrl}
                alt="Generated Word Cloud"
                width={700}
                height={437}
                className="h-[400px] w-full sm:w-[80%]"
                priority
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 h-[437px] w-full bg-gray-50 rounded-md">
                <ImageOff className="w-16 h-16 mb-2" />
                <p className="text-sm">Word cloud image not available.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-4 w-full mt-6">
        <Button
          onClick={handleProceed}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold shadow-md transition-all hover:shadow-lg w-full sm:w-auto sm:min-w-[160px]"
        >
          Proceed
          <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useCallback, memo, useState, Fragment } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useFile } from "../../contexts/file-context";
import { Loader2, Download, Check, ArrowRight, X, ChevronsUpDown } from "lucide-react";
import toast from "react-hot-toast";
import { fileService } from "../../services/file-service";
import { useRouter } from "next/navigation";

export const LANGUAGE_CONFIG = {
  english: {
    analyzers: {
      spacy: "spaCy"
    },
    name: "영어 (English)"
  },
  korean: {
    analyzers: {
      hannanum: "한나눔 (Hannanum)",
      kkma: "꼬꼬마 (Kkma)",
      komoran: "코모란 (Komoran)",
      okt: "Open Korean Text (Okt)"
    },
    name: "한국어 (Korean)"
  }
} as const;

export type LanguageKey = keyof typeof LANGUAGE_CONFIG;

const ANALYZER_SETTINGS = [
  { value: "adjective", label: "형용사 (Adjective)" },
  { value: "pos_tag", label: "품사 태그 (POS Tag)" }
] as const;

const WORD_LENGTH_OPTIONS = Array.from({ length: 11 }, (_, i) => (i + 2).toString());

export const POS_TAGS_OPTIONS = {
  korean: {
    'Noun': '명사',
    'Verb': '동사',
    'Adjective': '형용사',
    'Adverb': '부사',
    // 'Determiner': '관형사',
    // 'Exclamation': '감탄사',
    // 'Josa': '조사',
    // 'Eomi': '어미',
    // 'Suffix': '접미사',
    // 'Prefix': '접두사'
  },
  english: {
    'Noun': '명사',
    'JJ': '형용사',
    'VB': '동사(원형)'
  }
} as const;

interface PreprocessingFormProps {
  language: LanguageKey;
  setLanguage: (value: LanguageKey) => void;
  column: string;
  setColumn: (value: string) => void;
  analyzer: string;
  setAnalyzer: (value: string) => void;
  analyzerSetting: string[];
  setAnalyzerSetting: (value: string[] | ((prevState: string[]) => string[])) => void;
  wordLength: string;
  setWordLength: (value: string) => void;
  fileName: string;
  setFileName: (value: string) => void;
  selectedColumns: string[];
  onProcess: () => void;
}

const FormField = memo(function FormField({ 
  label, 
  children 
}: { 
  label: string; 
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 w-full">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
});

const selectStyles = {
  trigger: "h-10 w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500 [&>svg]:text-blue-500 [&>svg]:stroke-[2.5] cursor-pointer",
  content: "bg-white border-blue-200",
  item: "text-gray-700 hover:bg-blue-50 hover:text-blue-600 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-600 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-600 cursor-pointer",
  separator: "bg-blue-100",
  label: "text-blue-600 font-medium",
  group: "text-blue-600 font-medium"
};

export function PreprocessingForm({
  language = "korean",
  setLanguage,
  column,
  setColumn,
  analyzer,
  setAnalyzer,
  analyzerSetting,
  setAnalyzerSetting,
  wordLength,
  setWordLength,
  fileName,
  setFileName,
  selectedColumns,
  onProcess,
}: PreprocessingFormProps) {
  const { fileData } = useFile();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [processedFileUrl, setProcessedFileUrl] = useState<string | null>(null);
  const [openPosTagSelector, setOpenPosTagSelector] = useState(false);

  // Reset analyzer and analyzer setting when language changes
  useEffect(() => {
    const languageConfig = LANGUAGE_CONFIG[language];
    const firstAnalyzer = Object.keys(languageConfig.analyzers)[0];
    setAnalyzer(firstAnalyzer as string);
    
    // Set default POS tags for the new language as an array
    const firstPosTagForLang = Object.keys(POS_TAGS_OPTIONS[language])[0];
    if (firstPosTagForLang) {
      setAnalyzerSetting([firstPosTagForLang]);
    } else {
      setAnalyzerSetting([]);
    }
  }, [language, setAnalyzer, setAnalyzerSetting]);

  const currentLanguageConfig = LANGUAGE_CONFIG[language];
  const currentPosTagsOptions = POS_TAGS_OPTIONS[language];

  const handleProcess = async () => {
    if (!column || !wordLength || !fileName || analyzerSetting.length === 0) {
        toast.error("Please fill in all required fields, including at least one POS tag.");
        return;
    }
    setIsProcessing(true);

    const processPromise = fileService.process({
        column_name: column,
        language,
        analyzer,
        pos_tags: analyzerSetting,
        min_word_length: wordLength,
        // custom_filename: fileName
    });

    toast.promise(processPromise, {
      loading: 'Processing file...',
      success: (data: any) => {
        if (data.download_url) {
          setProcessedFileUrl(`https://analysis-app-ruud.onrender.com${data.download_url}`);
        }
        setIsProcessed(true);
        return 'File processed successfully!';
      },
      error: (err) => {
        console.error('Processing error:', err);
        return 'Failed to process file. Please try again.';
      },
    }).finally(() => {
      setIsProcessing(false);
    });
  };

  const handleDownload = () => {
    if (processedFileUrl) {
      const link = document.createElement('a');
      link.href = processedFileUrl;
      const downloadFileName = fileName || (fileData?.filename ? fileData.filename.split('.')[0] : 'processed_file');
      link.download = `${downloadFileName}_processed.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleProceedToAnalysis = () => {
    router.push('/analysis');
  };

  const handlePosTagSelect = useCallback((tagKey: string) => {
    let newAnalyzerSetting;
    if (analyzerSetting.includes(tagKey)) {
      newAnalyzerSetting = analyzerSetting.filter(t => t !== tagKey);
    } else {
      newAnalyzerSetting = [...analyzerSetting, tagKey];
    }
    setAnalyzerSetting(newAnalyzerSetting);
  }, [analyzerSetting, setAnalyzerSetting]);

  return (
    <Card className="p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <FormField label="Language">
            <Select value={language} onValueChange={(value: LanguageKey) => setLanguage(value)}>
              <SelectTrigger className={selectStyles.trigger}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={selectStyles.content}>
                {Object.entries(LANGUAGE_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key as LanguageKey} className={selectStyles.item}>
                    {config.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Column">
            <Select value={column} onValueChange={setColumn}>
              <SelectTrigger className={selectStyles.trigger}>
                <SelectValue placeholder="Select column | 열 선택" />
              </SelectTrigger>
              <SelectContent className={selectStyles.content}>
                {selectedColumns.map((col) => (
                  <SelectItem key={col} value={col} className={selectStyles.item}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Morphological Analyzer">
            <Select value={analyzer} onValueChange={setAnalyzer}>
              <SelectTrigger className={selectStyles.trigger}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={selectStyles.content}>
                {Object.entries(currentLanguageConfig.analyzers).map(([key, name]) => (
                  <SelectItem key={key} value={key} className={selectStyles.item}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="POS Tags (Analyzer Setting)">
            <Popover open={openPosTagSelector} onOpenChange={setOpenPosTagSelector}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openPosTagSelector}
                  className={`w-full justify-between ${selectStyles.trigger}`}
                >
                  <span className="truncate">
                    {analyzerSetting.length === 0
                      ? "Select POS tags..."
                      : analyzerSetting.map(tagKey => currentPosTagsOptions[tagKey as keyof typeof currentPosTagsOptions] || tagKey).join(", ")}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Search POS tags..." />
                  <CommandList>
                    <CommandEmpty>No POS tags found.</CommandEmpty>
                    <CommandGroup>
                      {Object.entries(currentPosTagsOptions).map(([tagKey, tagLabel]) => (
                        <CommandItem
                          key={tagKey}
                          value={tagKey}                          
                          onSelect={() => handlePosTagSelect(tagKey)}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${analyzerSetting.includes(tagKey) ? "opacity-100" : "opacity-0"}`}
                          />
                          {tagLabel} ({tagKey})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormField>

          <FormField label="Word Length">
            <Input
              type="number"
              value={wordLength}
              onChange={(e) => setWordLength(e.target.value)}
              className="h-10 w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="단어 길이 입력 (2,3)"
            />
          </FormField>

          <FormField label="File Name">
            <Input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="h-10 w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
              placeholder="Enter file name"
              readOnly
            />
          </FormField>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button
            onClick={handleProcess}
            disabled={!column || !wordLength || !fileName || isProcessing || isProcessed || analyzerSetting.length === 0}
            className={`rounded-[45px] px-8 py-2 text-sm min-w-[120px] ${
              isProcessed 
                ? 'bg-transparent text-green-600 border border-green-600 hover:bg-green-50'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } disabled:cursor-not-allowed cursor-pointer`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : isProcessed ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Processed
              </>
            ) : (
              'Process'
            )}
          </Button>
          
          {isProcessed && processedFileUrl && (
            <Button
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700 text-white rounded-[45px] px-8 py-2 text-sm min-w-[120px] "
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
        </div>

        {isProcessed && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleProceedToAnalysis}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-[45px] px-8 py-2 text-sm min-w-[180px]"
            >
              Proceed
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
} 
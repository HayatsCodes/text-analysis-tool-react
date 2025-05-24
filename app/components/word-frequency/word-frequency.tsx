import React, { memo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useFile } from "../../contexts/file-context";
import { fileService } from "../../services/file-service";
import toast from "react-hot-toast";

interface WordFrequencyFormProps {
  onAnalyzed: (analysisResult: any) => void; // Can be more specific with analysis result type
}

type CloudShapeType = "rectangle" | "circle" | "triangle" | "diamond";
type SelectionMethodType = "top_n" | "manual";
type BackendCloudColorType = 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'teal';

const WORD_CLOUD_FORMATS: { value: CloudShapeType, label: string }[] = [
  { value: "rectangle", label: "Rectangle" },
  { value: "circle", label: "Circle" },
  { value: "triangle", label: "Triangle" },
  { value: "diamond", label: "Diamond" },
];

const WORD_SELECTION_METHODS: { value: SelectionMethodType, label: string }[] = [
  { value: "top_n", label: "Automatically Select Top N words" },
  { value: "manual", label: "Manual Selection" },
];

const WORD_CLOUD_COLORS: { value: BackendCloudColorType, label: string }[] = [
  { value: "blue", label: "Blue Theme" }, // Example: "blue-green" maps to "blue"
  { value: "green", label: "Green Theme" },
  { value: "red", label: "Red Theme" },
  { value: "purple", label: "Purple Theme" },
  { value: "orange", label: "Orange Theme" },
  { value: "teal", label: "Teal Theme" },
];

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
};

export function WordFrequencyForm({ onAnalyzed }: WordFrequencyFormProps) {
  const { fileData } = useFile();
  const [column, setColumn] = useState("");
  const [format, setFormat] = useState<CloudShapeType>("rectangle");
  const [selectionMethod, setSelectionMethod] = useState<SelectionMethodType>("top_n");
  const [colors, setColors] = useState<BackendCloudColorType>("blue"); // Default to a valid theme
  const [maxWords, setMaxWords] = useState("50");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function handleAnalyze() {
    if (!column) {
      toast.error("Please select a text column.");
      return;
    }
    setIsAnalyzing(true);

    const analysisPromise = fileService.analyzeWordFrequency({
      column_name: column,
      selection_type: selectionMethod,
      max_words: parseInt(maxWords, 10),
      cloud_shape: format,
      cloud_color: colors,
    });

    toast.promise(analysisPromise, {
      loading: 'Analyzing word frequency...',
      success: (data) => {
        onAnalyzed(data); // Pass analysis result to parent
        return 'Analysis successful!';
      },
      error: (err) => {
        console.error("Analysis error:", err);
        return err.message || 'Analysis failed. Please try again.';
      },
    }).finally(() => {
      setIsAnalyzing(false);
    });
  }

  return (
    <div className="w-full max-w-md py-6 sm:py-8">
      <Card className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <FormField label="Select Text Column">
            <Select value={column} onValueChange={setColumn}>
              <SelectTrigger className={selectStyles.trigger}>
                <SelectValue placeholder="Process" />
              </SelectTrigger>
              <SelectContent className={selectStyles.content}>
                {fileData?.columns?.map(col => (
                  <SelectItem key={col} value={col} className={selectStyles.item}>{col}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <div className="space-y-3 sm:space-y-4">
            <FormField label="Word Cloud Format">
              <Select value={format} onValueChange={(value) => setFormat(value as CloudShapeType)}>
                <SelectTrigger className={selectStyles.trigger}>
                  <SelectValue placeholder="Rectangle" />
                </SelectTrigger>
                <SelectContent className={selectStyles.content}>
                  {WORD_CLOUD_FORMATS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} className={selectStyles.item}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Word Selection Method">
              <Select value={selectionMethod} onValueChange={(value) => setSelectionMethod(value as SelectionMethodType)}>
                <SelectTrigger className={selectStyles.trigger}>
                  <SelectValue placeholder="Automatically Select Top N words" />
                </SelectTrigger>
                <SelectContent className={selectStyles.content}>
                  {WORD_SELECTION_METHODS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} className={selectStyles.item}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Word Cloud Colors">
              <Select value={colors} onValueChange={(value) => setColors(value as BackendCloudColorType)}>
                <SelectTrigger className={selectStyles.trigger}>
                  <SelectValue placeholder="Blue Theme" />
                </SelectTrigger>
                <SelectContent className={selectStyles.content}>
                  {WORD_CLOUD_COLORS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} className={selectStyles.item}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Maximum Words">
              <Input
                type="number"
                value={maxWords}
                onChange={e => setMaxWords(e.target.value)}
                className="h-10 w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="50"
                min={1}
                max={200}
              />
            </FormField>
          </div>

          <div className="flex justify-center pt-2 sm:pt-4">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !column}
              className="bg-blue-600 text-white rounded-full px-8 py-2 font-semibold shadow hover:bg-blue-700 transition-colors min-w-[220px]"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2"><Loader2 className="animate-spin w-5 h-5" /> Analyzing...</span>
              ) : (
                "Analyze Word Frequency"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

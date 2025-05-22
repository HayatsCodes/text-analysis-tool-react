import React, { memo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useFile } from "../../contexts/file-context";

interface WordFrequencyFormProps {
  onAnalyzed: () => void;
}

const WORD_CLOUD_FORMATS = [
  { value: "oblong", label: "Oblong" },
  { value: "square", label: "Square" },
];

const WORD_SELECTION_METHODS = [
  { value: "top_n", label: "Automatically Select Top N words" },
  { value: "manual", label: "Manual Selection" },
];

const WORD_CLOUD_COLORS = [
  { value: "blue-purple", label: "Blue-Purple" },
  { value: "red-yellow", label: "Red-Yellow" },
  { value: "green-orange", label: "Green-Orange" },
];

const EDIT_WORD_OPTIONS = [
  { value: "edit", label: "Edit or delete keywords" },
  { value: "none", label: "None" },
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
  const [format, setFormat] = useState("oblong");
  const [selectionMethod, setSelectionMethod] = useState("top_n");
  const [colors, setColors] = useState("blue-purple");
  const [maxWords, setMaxWords] = useState("50");
  const [editWord, setEditWord] = useState("edit");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  function handleAnalyze() {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      onAnalyzed();
    }, 1800); // Mock API delay
  }

  return (
    <div className="w-full max-w-md">
      <Card className="p-6">
        <div className="space-y-6">
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

          <div className="space-y-4">
            <FormField label="Word Cloud Format">
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className={selectStyles.trigger}>
                  <SelectValue placeholder="Oblong" />
                </SelectTrigger>
                <SelectContent className={selectStyles.content}>
                  {WORD_CLOUD_FORMATS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} className={selectStyles.item}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Word Selection Method">
              <Select value={selectionMethod} onValueChange={setSelectionMethod}>
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
              <Select value={colors} onValueChange={setColors}>
                <SelectTrigger className={selectStyles.trigger}>
                  <SelectValue placeholder="Blue-Purple" />
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

          <FormField label="Edit Word">
            <Select value={editWord} onValueChange={setEditWord}>
              <SelectTrigger className={selectStyles.trigger}>
                <SelectValue placeholder="Edit or delete keywords" />
              </SelectTrigger>
              <SelectContent className={selectStyles.content}>
                {EDIT_WORD_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className={selectStyles.item}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <div className="flex justify-center pt-4">
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

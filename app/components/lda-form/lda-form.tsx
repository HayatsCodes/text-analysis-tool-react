import React, { memo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useFile } from "../../contexts/file-context";

interface LDAFormProps {
  onProcessed: () => void;
}

const VISUALIZATION_STYLES = [
  { value: "academic", label: "Academic (Basic)" },
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

export function LDAForm({ onProcessed }: LDAFormProps) {
  const { fileData } = useFile();
  const [column, setColumn] = useState("");
  const [visualizationStyle, setVisualizationStyle] = useState("academic");
  const [minTopics, setMinTopics] = useState("20");
  const [maxTopics, setMaxTopics] = useState("50");
  const [minDocFreq, setMinDocFreq] = useState("10");
  const [maxDocFreq, setMaxDocFreq] = useState("48");
  const [isProcessing, setIsProcessing] = useState(false);

  function handleProcess() {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      onProcessed();
    }, 2000);
  }

  return (
    <div className="w-full max-w-md">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <FormField label="Visualization Style">
              <Select value={visualizationStyle} onValueChange={setVisualizationStyle}>
                <SelectTrigger className={selectStyles.trigger}>
                  <SelectValue placeholder="Academic (Basic)" />
                </SelectTrigger>
                <SelectContent className={selectStyles.content}>
                  {VISUALIZATION_STYLES.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} className={selectStyles.item}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Select Column">
              <Select value={column} onValueChange={setColumn}>
                <SelectTrigger className={selectStyles.trigger}>
                  <SelectValue placeholder="Process" />
                </SelectTrigger>
                <SelectContent className={selectStyles.content}>
                  {fileData?.columns?.map(col => (
                    <SelectItem key={col} value={col} className={selectStyles.item}>
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="space-y-4">
            <FormField label="Minimum Number of Topics">
              <Input
                type="number"
                value={minTopics}
                onChange={e => setMinTopics(e.target.value)}
                className="h-10 w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="20"
                min={1}
              />
            </FormField>

            <FormField label="Maximum Number of Topics">
              <Input
                type="number"
                value={maxTopics}
                onChange={e => setMaxTopics(e.target.value)}
                className="h-10 w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="50"
                min={1}
              />
            </FormField>
          </div>

          <div className="space-y-4">
            <FormField label="Minimum Document Frequency">
              <Input
                type="number"
                value={minDocFreq}
                onChange={e => setMinDocFreq(e.target.value)}
                className="h-10 w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="10"
                min={1}
              />
            </FormField>

            <FormField label="Maximum Document Frequency">
              <Input
                type="number"
                value={maxDocFreq}
                onChange={e => setMaxDocFreq(e.target.value)}
                className="h-10 w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="48"
                min={1}
              />
            </FormField>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleProcess}
              disabled={isProcessing || !column}
              className="bg-blue-600 text-white rounded-full px-8 py-2 font-semibold shadow hover:bg-blue-700 transition-colors min-w-[220px]"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" />
                  Processing...
                </span>
              ) : (
                "Process File"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 
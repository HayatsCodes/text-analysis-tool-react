import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, Edit3, RefreshCw, Trash2, FilePenLine, CheckCircle } from "lucide-react";
import { LDAResponse, LDATopic, LDAKeyword } from "../../types/lda"; // Import necessary types

export interface LDAKeywordEditorProps {
  ldaResponse: LDAResponse;
  onNext: () => void;
}

// Helper function to parse the keyword string from the backend
function parseKeywordsString(topicId: number, wordsString: string): LDAKeyword[] {
  if (!wordsString) return [];
  return wordsString.split(' + ').map((part, index) => {
    const [weightStr, keywordWithQuotes] = part.split('*');
    const weight = parseFloat(weightStr);
    // Remove surrounding quotes and potential extra escaped quotes from keyword
    const text = keywordWithQuotes ? keywordWithQuotes.replace(/^"|"$/g, '').replace(/\"/g, '"') : "";
    return {
      id: `topic${topicId}_kw${index}`,
      text,
      weight,
    };
  }).filter(kw => kw.text && !isNaN(kw.weight)); // Ensure keyword text exists and weight is a number
}

export function LDAKeywordEditor({ ldaResponse, onNext }: LDAKeywordEditorProps) {
  // Parse optimal_topic_num and topics from ldaResponse
  const initialOptimalTopics = ldaResponse.optimal_topic_num || 8; // Fallback if not present
  const parsedAndSortedTopics: LDATopic[] = ldaResponse.topics
    .map(topic => ({
      id: topic.id,
      name: `Topic ${topic.id}`,
      keywords: parseKeywordsString(topic.id, topic.words),
      originalWordsString: topic.words,
    }))
    .sort((a, b) => a.id - b.id); // Sort topics by ID in ascending order

  const [optimalTopics, setOptimalTopics] = useState(initialOptimalTopics);
  const [isEditingOptimalTopics, setIsEditingOptimalTopics] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(
    parsedAndSortedTopics.length > 0 ? parsedAndSortedTopics[0].id : null
  );

  const selectedTopicData = parsedAndSortedTopics.find(t => t.id === selectedTopicId) || 
                          (parsedAndSortedTopics.length > 0 ? parsedAndSortedTopics[0] : null);

  // Handle case where there might be no topics
  if (!parsedAndSortedTopics || parsedAndSortedTopics.length === 0) {
    return (
      <Card className="w-full max-w-4xl mt-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">LDA Topic & Keyword Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 py-8">No topic data available to display.</p>
        </CardContent>
        <CardFooter className="flex justify-end pt-6">
          <Button onClick={onNext} variant="outline">
            Proceed (No Data)
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">LDA Topic & Keyword Editor</CardTitle>
        <CardDescription>
          Review and refine the optimal number of topics and associated keywords.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Optimal Number of Topics Section */}
        <div className="space-y-3 p-4 border rounded-lg bg-slate-50">
          <h3 className="text-lg font-medium text-gray-800">Optimal Number of Topics</h3>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={optimalTopics}
              onChange={(e) => setOptimalTopics(parseInt(e.target.value, 10))}
              className="w-24 h-9 focus-visible:ring-blue-500"
              readOnly={!isEditingOptimalTopics}
            />
            {isEditingOptimalTopics ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsEditingOptimalTopics(false)}
                  className="bg-green-600 hover:bg-green-700 text-white h-9"
                >
                  <CheckCircle className="mr-1.5 h-4 w-4" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { /* Potentially reset changes */ setIsEditingOptimalTopics(false);}}
                  className="h-9"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingOptimalTopics(true)}
                className="text-blue-700 border-blue-600 hover:bg-blue-50 hover:text-blue-700 h-9"
              >
                <FilePenLine className="mr-1.5 h-4 w-4" />
                Edit
            </Button>
            )}
          </div>
        </div>

        {/* Keyword Editor Section */}
        <div className="space-y-3 p-4 border rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-1">Keyword Editor</h3>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label htmlFor="topic-select" className="text-sm font-medium text-gray-700">
                Select Topic:
              </label>
              <Select 
                value={selectedTopicId !== null ? String(selectedTopicId) : undefined} 
                onValueChange={(value) => setSelectedTopicId(Number(value))}
              >
                <SelectTrigger className="w-[180px] h-9 focus:ring-blue-500">
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  {parsedAndSortedTopics.map((topic) => (
                    <SelectItem key={topic.id} value={String(topic.id)}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-500 hover:bg-blue-50 hover:text-blue-600 h-9"
              // onClick={() => { /* Logic to re-apply/re-fetch keywords if necessary */ }}
            >
              <RefreshCw className="mr-1.5 h-4 w-4" />
              Refresh Keywords
            </Button>
            <span className="bg-blue-100 text-blue-700 text-xs rounded-full px-3 py-1.5 font-semibold">
              {selectedTopicData ? selectedTopicData.keywords.length : 0} keywords
            </span>
          </div>

          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-16 text-gray-600 font-semibold">S/N</TableHead>
                  <TableHead className="text-gray-600 font-semibold">Keyword</TableHead>
                  <TableHead className="w-28 text-right text-gray-600 font-semibold">Weight</TableHead>
                  <TableHead className="w-40 text-center text-gray-600 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedTopicData && selectedTopicData.keywords.map((keyword, index) => (
                  <TableRow key={keyword.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium text-gray-700">{String(index + 1).padStart(2, '0')}</TableCell>
                    <TableCell className="text-gray-800">{keyword.text}</TableCell>
                    <TableCell className="text-right text-gray-600">{keyword.weight.toFixed(4)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        <Button variant="outline" size="icon" className="h-7 w-7 text-blue-600 border-blue-500 hover:bg-blue-50">
                          <Edit3 className="h-4 w-4" />
                      </Button>
                        <Button variant="outline" size="icon" className="h-7 w-7 text-red-600 border-red-500 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                      </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-6">
      <Button
        onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-2 text-base font-medium shadow-md transition-colors min-w-[200px]"
      >
        Proceed to Visualization
          <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
      </CardFooter>
    </Card>
  );
} 
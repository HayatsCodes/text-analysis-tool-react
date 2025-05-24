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

export function LDAKeywordEditor({ ldaResponse }: LDAKeywordEditorProps) {
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
      <Card className="w-full max-w-5xl mt-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">LDA Topic & Keyword Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 py-8">No topic data available to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-5xl mt-4 sm:mt-6 shadow-lg">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-semibold">LDA Topic & Keyword Editor</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Review and refine the optimal number of topics and associated keywords.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Optimal Number of Topics Section */}
        <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 border rounded-lg bg-slate-50">
          <h3 className="text-base sm:text-lg font-medium text-gray-800">Optimal Number of Topics</h3>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Input
              type="number"
              value={optimalTopics}
              onChange={(e) => setOptimalTopics(parseInt(e.target.value, 10))}
              className="w-20 sm:w-24 h-8 sm:h-9 focus-visible:ring-blue-500 text-sm"
              readOnly={!isEditingOptimalTopics}
            />
            {isEditingOptimalTopics ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsEditingOptimalTopics(false)}
                  className="bg-green-600 hover:bg-green-700 text-white h-8 sm:h-9 text-xs sm:text-sm"
                >
                  <CheckCircle className="mr-1 h-3 w-3 sm:mr-1.5 sm:h-4 sm:w-4" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { /* Potentially reset changes */ setIsEditingOptimalTopics(false);}}
                  className="h-8 sm:h-9 text-xs sm:text-sm"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingOptimalTopics(true)}
                className="text-blue-700 border-blue-600 hover:bg-blue-50 hover:text-blue-700 h-8 sm:h-9 text-xs sm:text-sm"
              >
                <FilePenLine className="mr-1 h-3 w-3 sm:mr-1.5 sm:h-4 sm:w-4" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Keyword Editor Section */}
        <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 border rounded-lg">
          <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-1">Keyword Editor</h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label htmlFor="topic-select" className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                Select Topic:
              </label>
              <Select 
                value={selectedTopicId !== null ? String(selectedTopicId) : undefined} 
                onValueChange={(value) => setSelectedTopicId(Number(value))}
              >
                <SelectTrigger className="w-full sm:w-[180px] h-8 sm:h-9 focus:ring-blue-500 text-xs sm:text-sm">
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
              className="text-blue-600 border-blue-500 hover:bg-blue-50 hover:text-blue-600 h-8 sm:h-9 text-xs sm:text-sm"
              // onClick={() => { /* Logic to re-apply/re-fetch keywords if necessary */ }}
            >
              <RefreshCw className="mr-1 h-3 w-3 sm:mr-1.5 sm:h-4 sm:w-4" />
              Refresh Keywords
            </Button>
            <span className="bg-blue-100 text-blue-700 text-xs rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 font-semibold">
              {selectedTopicData ? selectedTopicData.keywords.length : 0} keywords
            </span>
          </div>

          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-12 sm:w-16 px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-600 font-semibold">S/N</TableHead>
                  <TableHead className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-600 font-semibold">Keyword</TableHead>
                  <TableHead className="w-20 sm:w-28 px-2 py-2 sm:px-4 sm:py-3 text-right text-xs sm:text-sm text-gray-600 font-semibold">Weight</TableHead>
                  <TableHead className="w-28 sm:w-40 px-2 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm text-gray-600 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedTopicData && selectedTopicData.keywords.map((keyword, index) => (
                  <TableRow key={keyword.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium text-gray-700 px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm">{String(index + 1).padStart(2, '0')}</TableCell>
                    <TableCell className="text-gray-800 px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm">{keyword.text}</TableCell>
                    <TableCell className="text-right text-gray-600 px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm">{keyword.weight.toFixed(4)}</TableCell>
                    <TableCell className="text-center px-2 py-2 sm:px-4 sm:py-3">
                      <div className="flex gap-1.5 sm:gap-2 justify-center">
                        <Button variant="outline" size="icon" className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600 border-blue-500 hover:bg-blue-50">
                          <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-6 w-6 sm:h-7 sm:w-7 text-red-600 border-red-500 hover:bg-red-50">
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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
    </Card>
  );
} 
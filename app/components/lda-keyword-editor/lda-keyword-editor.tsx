import React, { useState, useEffect, useMemo } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ArrowRight, Edit3, RefreshCw, Trash2, FilePenLine, CheckCircle, Loader2, DownloadCloud } from "lucide-react";
import { LDAResponse, LDATopic, LDAKeyword } from "../../types/lda"; // Import necessary types
import { fileService } from "../../services/file-service"; // Import fileService
import toast from 'react-hot-toast'; // Import react-hot-toast

export interface LDAKeywordEditorProps {
  ldaResponse: LDAResponse | null;
  onKeywordsUpdated: (updatedData: Partial<LDAResponse>) => void;
}

// Helper function to parse the keyword string from the backend
function parseKeywordsString(topicId: number, wordsString: string): LDAKeyword[] {
  if (!wordsString) return [];
  return wordsString.split(' + ').map((part, index) => {
    const [weightStr, keywordWithQuotes] = part.split('*');
    const weight = parseFloat(weightStr);
    // Remove surrounding quotes and potential extra escaped quotes from keyword
    const text = keywordWithQuotes ? keywordWithQuotes.replace(/^"|"$/g, '').replace(/\"\"\"/g, '"') : "";
    return {
      id: `topic${topicId}_kw${index}`,
      text,
      weight,
    };
  }).filter(kw => kw.text && !isNaN(kw.weight)); // Ensure keyword text exists and weight is a number
}

export function LDAKeywordEditor({ ldaResponse, onKeywordsUpdated }: LDAKeywordEditorProps) {
  const [parsedTopics, setParsedTopics] = useState<LDATopic[]>([]);
  const [optimalTopics, setOptimalTopics] = useState(8); // Default value
  const [isEditingOptimalTopics, setIsEditingOptimalTopics] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [editingKeyword, setEditingKeyword] = useState<LDAKeyword | null>(null);
  const [newKeywordText, setNewKeywordText] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSavingKeyword, setIsSavingKeyword] = useState(false);
  const [deletingKeywordId, setDeletingKeywordId] = useState<string | null>(null); // State for deleting keyword ID

  useEffect(() => {
    const topicsArray = ldaResponse?.topics;
    const optimalTopicNum = ldaResponse?.optimal_topic_num;

    if (topicsArray && Array.isArray(topicsArray)) {
      const newParsedTopics = topicsArray
    .map(topic => ({
      id: topic.id,
      name: `Topic ${topic.id}`,
      keywords: parseKeywordsString(topic.id, topic.words),
      originalWordsString: topic.words,
    }))
        .sort((a, b) => a.id - b.id);
      setParsedTopics(newParsedTopics);

      const currentSelectionIsValid = newParsedTopics.some(topic => topic.id === selectedTopicId);
      if (!currentSelectionIsValid) {
        setSelectedTopicId(newParsedTopics.length > 0 ? newParsedTopics[0].id : null);
      }
    } else {
      setParsedTopics([]);
      setSelectedTopicId(null);
    }
    setOptimalTopics(optimalTopicNum || 8);

  }, [ldaResponse]); // Dependency array only on ldaResponse

  const selectedTopicData = useMemo(() => {
    // Ensure selectedTopicId is valid for the current parsedTopics
    if (selectedTopicId === null) return null;
    const topic = parsedTopics.find(t => t.id === selectedTopicId);
    if (topic) return topic;
    // If selectedTopicId is not found (e.g. after topics update), return first topic or null
    return parsedTopics.length > 0 ? parsedTopics[0] : null;
  }, [parsedTopics, selectedTopicId]);

  async function handleSaveEditedKeyword() {
    if (!editingKeyword || selectedTopicId === null || isSavingKeyword) return;

    setIsSavingKeyword(true);
    const originalText = editingKeyword.text;
    try {
      const response = await fileService.editLDAKeywords({
        topic_id: selectedTopicId,
        edited_words: [{ original: originalText, new: newKeywordText }],
      });
      onKeywordsUpdated(response);
      toast.success(`Keyword "${originalText}" updated to "${newKeywordText}" successfully!`);
      setIsEditDialogOpen(false);
      setEditingKeyword(null);
      setNewKeywordText("");
    } catch (error) {
      console.error("Failed to edit keyword:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error(`Failed to update keyword "${originalText}". ${errorMessage}`);
    } finally {
      setIsSavingKeyword(false);
    }
  }

  async function handleDeleteKeyword(keywordToDelete: LDAKeyword) {
    if (selectedTopicId === null || deletingKeywordId !== null) return; // Prevent multiple simultaneous deletes

    setDeletingKeywordId(keywordToDelete.id);
    try {
      const response = await fileService.editLDAKeywords({
        topic_id: selectedTopicId,
        removed_words: [keywordToDelete.text],
      });
      onKeywordsUpdated(response);
      toast.success(`Keyword "${keywordToDelete.text}" deleted successfully!`);
    } catch (error) {
      console.error("Failed to delete keyword:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error(`Failed to delete keyword "${keywordToDelete.text}". ${errorMessage}`);
    } finally {
      setDeletingKeywordId(null);
    }
  }

  function openEditDialog(keyword: LDAKeyword) {
    setEditingKeyword(keyword);
    setNewKeywordText(keyword.text);
    setIsEditDialogOpen(true);
  }

  // Handle case where there might be no topics
  if (!parsedTopics || parsedTopics.length === 0) {
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
        <div className="space-y-3 p-3 sm:p-4 border rounded-lg bg-slate-50">
          <h3 className="text-base sm:text-lg font-medium text-gray-800">Optimal Number of Topics</h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input
                type="number"
                value={optimalTopics}
                onChange={(e) => setOptimalTopics(parseInt(e.target.value, 10))}
                className="w-20 sm:w-24 h-9 focus-visible:ring-blue-500 text-sm"
                readOnly={!isEditingOptimalTopics}
              />
              {isEditingOptimalTopics ? (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setIsEditingOptimalTopics(false)}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                  >
                    <CheckCircle className="mr-1 h-3 w-3 sm:mr-1.5 sm:h-4 sm:w-4" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { /* Potentially reset changes */ setIsEditingOptimalTopics(false);}}
                    className="text-xs sm:text-sm"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingOptimalTopics(true)}
                  className="text-blue-700 border-blue-600 hover:bg-blue-50 hover:text-blue-700 text-xs sm:text-sm"
                >
                  <FilePenLine className="mr-1 h-3 w-3 sm:mr-1.5 sm:h-4 sm:w-4" />
                  Edit
                </Button>
              )}
            </div>
          
            <Button
              variant="default"
              size="sm"
              onClick={() => ldaResponse?.csv_download_url && window.open(ldaResponse.csv_download_url, 'blank')}
              disabled={!ldaResponse?.csv_download_url}
              className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm w-full sm:w-auto"
            >
              <DownloadCloud className="mr-1 h-3 w-3 sm:mr-1.5 sm:h-4 sm:w-4" />
              Download All
            </Button>
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
                  {parsedTopics.map((topic) => (
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
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600 border-blue-500 hover:bg-blue-50"
                          onClick={() => openEditDialog(keyword)}
                          disabled={deletingKeywordId !== null || isSavingKeyword} // Disable if any delete/save is in progress
                        >
                          <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-6 w-6 sm:h-7 sm:w-7 text-red-600 border-red-500 hover:bg-red-50"
                          onClick={() => handleDeleteKeyword(keyword)}
                          disabled={deletingKeywordId === keyword.id || deletingKeywordId !== null || isSavingKeyword} // Disable if this one is deleting, or any other delete is happening, or save is in progress
                        >
                          {deletingKeywordId === keyword.id ? (
                            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                          ) : (
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          )}
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
      {/* Edit Keyword Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Keyword</DialogTitle>
            <DialogDescription>
              Make changes to your keyword here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="keyword-text" className="text-right">
                Keyword
              </label>
              <Input
                id="keyword-text"
                value={newKeywordText}
                onChange={(e) => setNewKeywordText(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
               <Button type="button" variant="outline" disabled={isSavingKeyword}>Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveEditedKeyword} disabled={isSavingKeyword}>
              {isSavingKeyword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSavingKeyword ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 
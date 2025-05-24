import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart3,
  Library,
  PieChart,
  Network as NetworkIcon,
  Cloud,
  PlayCircle,
  Edit3,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LDAResponse, LDAKeyword } from "../../types/lda";

type LdaTabValue = 'model' | 'topic' | 'chart' | 'network' | 'cloud' | 'interactive';

interface LDATabsProps {
  ldaResponse: LDAResponse | null;
}

function parseKeywordsString(topicId: number, wordsString: string): LDAKeyword[] {
  if (!wordsString) return [];
  return wordsString.split(' + ').map((part, index) => {
    const [weightStr, keywordWithQuotes] = part.split('*');
    const weight = parseFloat(weightStr);
    const text = keywordWithQuotes ? keywordWithQuotes.replace(/^"|"$/g, '').replace(/\\"/g, '"') : "";
    return {
      id: `topic${topicId}_kw${index}`,
      text,
      weight,
    };
  }).filter(kw => kw.text && !isNaN(kw.weight));
}

export function LDATabs({ ldaResponse }: LDATabsProps) {
  if (!ldaResponse) {
  return (
      <div className="w-full max-w-5xl mt-6 pb-6 flex items-center justify-center">
        <Card className="shadow-md p-8">
          <p className="text-lg text-gray-600">Loading LDA results or no data available...</p>
        </Card>
      </div>
    );
  }

  const { coherence_plot, perplexity_plot } = ldaResponse;

  return (
    <Tabs defaultValue="model" className="w-full max-w-5xl mt-6 pb-6">
      <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-4 h-auto">
        <TabsTrigger value="model" className="flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white">
          <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" /> Model Score
        </TabsTrigger>
        <TabsTrigger value="topic" className="flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white">
          <Library className="h-4 w-4 sm:h-5 sm:w-5" /> Topic
        </TabsTrigger>
        <TabsTrigger value="chart" className="flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white">
          <PieChart className="h-4 w-4 sm:h-5 sm:w-5" /> Topic Chart
        </TabsTrigger>
        <TabsTrigger value="network" className="flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white">
          <NetworkIcon className="h-4 w-4 sm:h-5 sm:w-5" /> Network
        </TabsTrigger>
        <TabsTrigger value="cloud" className="flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white">
          <Cloud className="h-4 w-4 sm:h-5 sm:w-5" /> Word Cloud
        </TabsTrigger>
        <TabsTrigger value="interactive" className="flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white">
          <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5" /> Interactive
        </TabsTrigger>
      </TabsList>

      <TabsContent value="model">
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Model Performance Scores</CardTitle>
            <CardDescription className="text-sm">Perplexity and Coherence scores for the generated LDA model.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <div className="border-2  rounded-lg p-4 bg-white">
              <h3 className="text-base font-medium text-gray-700 mb-2">Perplexity Score</h3>
              <div className="border w-full border-blue-500 rounded-lg h-96 bg-slate-50 flex items-center justify-center text-gray-400 text-xs overflow-hidden">
                {perplexity_plot ? (
                  <img src={`data:image/png;base64,${perplexity_plot}`} alt="Perplexity Plot" className="w-full max-h-full object-fit object-center" />
                ) : (
                  <p>Perplexity Plot not available.</p>
                )}
            </div>
            </div>
            <div className="border-2  rounded-lg p-4 bg-white">
              <h3 className="text-base font-medium text-gray-700 mb-2">Coherence Score</h3>
              <div className="border border-blue-500 rounded-lg h-96 bg-slate-50 flex items-center justify-center text-gray-400 text-xs overflow-hidden">
                {coherence_plot ? (
                  <img src={`data:image/png;base64,${coherence_plot}`} alt="Coherence Plot" className="w-full max-h-full object-fit object-center" />
                ) : (
                  <p>Coherence Plot not available.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="topic">
        <Card className="shadow-md">
           <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Topic Overview</CardTitle>
            <CardDescription className="text-sm">Keywords and details for each identified topic.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ldaResponse.topics && ldaResponse.topics.length > 0 ? (
              [...ldaResponse.topics]
                .sort((a, b) => a.id - b.id)
                .map(topic => {
                  const keywords = parseKeywordsString(topic.id, topic.words);
                  return (
                    <div key={topic.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex flex-row items-center justify-between mb-2">
                        <h3 className="text-base font-medium text-gray-700">Topic {topic.id}</h3>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="text-blue-600 border-blue-500 hover:bg-blue-50 hover:text-blue-700 h-8">
                            <Edit3 className="mr-1.5 h-3.5 w-3.5" />
                            Edit Keywords
                          </Button>
                          <span className="bg-blue-100 text-blue-700 text-xs rounded-full px-2.5 py-1 font-semibold">
                            {keywords.length} keywords
                          </span>
                        </div>
                      </div>
                      <div className="border rounded-md w-full min-h-[6rem] bg-slate-50 p-3 text-gray-700 text-xs">
                        {keywords.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {keywords.map(kw => (
                              <div key={kw.id} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs flex items-center shadow-sm">
                                <span>{kw.text}</span>
                                <span className="ml-1.5 text-blue-600 opacity-75 text-[0.65rem]">({kw.weight.toFixed(4)})</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-gray-500 italic">No keywords for this topic.</p>
                        )}
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="text-center text-gray-500 py-4">No topics available.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="chart">
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Topic Keyword Charts</CardTitle>
            <CardDescription className="text-sm">Visual representation of keyword weights within topics.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-2.5 mb-4 pb-3 border-b border-gray-200">
              <label htmlFor="chart-style-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">Chart Style:</label>
              <Select defaultValue="basic">
                <SelectTrigger className="w-full sm:w-[180px] h-9 focus:ring-blue-500 text-sm">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Style</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-9 text-xs px-4">
                <RefreshCw className="mr-1.5 h-4 w-4" />
                Apply
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {ldaResponse.topic_images && ldaResponse.topic_images.length > 0 ? (
                ldaResponse.topic_images.map((topicImage, index) => (
                  <div key={topicImage.id || index} className="border rounded-lg p-3 bg-white">
                    <div className="flex flex-row items-center justify-between mb-2">
                      <h3 className="text-base font-medium text-gray-700">Topic {index + 1} Chart</h3> 
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:bg-gray-200">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download Chart</span>
                      </Button>
                    </div>
                    <div className="border rounded-lg h-48 bg-slate-50 flex items-center justify-center text-gray-400 text-xs overflow-hidden">
                      {topicImage.url ? (
                        <img 
                          src={topicImage.url.replace(/^http:\/\//i, 'https://')}
                          alt={`Topic ${index + 1} Chart`} 
                          className="max-w-full max-h-full object-contain" 
                        />
                      ) : (
                        <p>Chart not available.</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4 md:col-span-2">No topic charts available.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="network">
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Topic-Keyword Network</CardTitle>
            <CardDescription className="text-sm">Interactive network visualization of topics and their keywords.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-2.5 mb-4 pb-3 border-b border-gray-200">
              <label htmlFor="network-style-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">Visualization Style:</label>
              <Select defaultValue="academic">
                <SelectTrigger className="w-full sm:w-[180px] h-9 focus:ring-blue-500 text-sm">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-9 text-xs px-4">
                <RefreshCw className="mr-1.5 h-4 w-4" />
                Apply
              </Button>
            </div>
            <div className="border rounded-lg h-80 bg-white flex items-center justify-center text-gray-400 text-xs">
              Network Visualization Area
          </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="cloud">
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Topic Word Clouds</CardTitle>
            <CardDescription className="text-sm">Word cloud representation for each identified topic.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(topicIndex => (
              <div key={topicIndex} className="border rounded-lg p-2 bg-white">
                <h3 className="text-sm font-medium text-gray-700 mb-1.5 px-1">Topic {topicIndex}</h3>
                <div className="border rounded-lg aspect-[4/3] bg-slate-50 flex items-center justify-center text-gray-400 text-xs">
                  Cloud for Topic {topicIndex}
        </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="interactive">
        <Card className="shadow-md">
           <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Interactive pyLDAvis View</CardTitle>
            <CardDescription className="text-sm">Explore topics and keywords with an interactive visualization (e.g., pyLDAvis).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700 mr-1 whitespace-nowrap">Selected Topic:</span>
              <Input type="number" defaultValue="3" className="w-16 h-9 text-center focus-visible:ring-blue-500 text-sm" readOnly />
              <Button variant="outline" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100">
                <ChevronLeft className="h-4.5 w-4.5" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100">
                <ChevronRight className="h-4.5 w-4.5" />
              </Button>
              <Button variant="outline" size="sm" className="h-9 text-gray-600 hover:bg-gray-100 text-xs px-3">
                <XCircle className="mr-1 h-4 w-4" />
              Clear
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-9 text-xs px-4 ml-auto">
                <RefreshCw className="mr-1.5 h-4 w-4" />
              Apply
              </Button>
          </div>
            <div className="border rounded-lg min-h-[20rem] h-80 bg-white flex items-center justify-center text-gray-400 text-xs">
              Interactive Visualization Area
          </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
} 
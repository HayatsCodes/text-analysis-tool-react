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

  const { coherence_plot, perplexity_plot, topic_images, network_img_url, pyldavis_html, wordcloud_paths } = ldaResponse;

  function handleDownloadChart(chartUrl?: string) {
    if (chartUrl) {
      let downloadUrl = chartUrl.replace(/^http:\/\//i, 'https://');
      const url = new URL(downloadUrl);
      url.searchParams.set('download', 'true');
      downloadUrl = url.toString();

      const link = document.createElement('a');
      link.href = downloadUrl;
      // link.download = `topic_chart_${/* you might want to add an ID or name here */}.png`; // Optional: to suggest a filename
      link.target = '_blank'; // Good practice to open in new tab if direct download is blocked
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('No chart URL available for download.');
      // Optionally, show a toast notification to the user
    }
  }

  let baseApiFilesUrl: string | null = null;
  let sessionId: string | null = null;

  const sourceUrlForParams = network_img_url || (topic_images && topic_images.length > 0 && topic_images[0].url) || null;

  if (sourceUrlForParams) {
    try {
      const exampleUrl = new URL(sourceUrlForParams.replace(/^http:\/\//i, 'https://'));
      sessionId = exampleUrl.searchParams.get('session_id');
      baseApiFilesUrl = `${exampleUrl.protocol}//${exampleUrl.host}/api/files/`;
    } catch (e) {
      console.error("Error parsing source URL for word cloud base URL:", e);
    }
  }

  return (
    <Tabs defaultValue="model" className="w-full max-w-5xl mt-4 sm:mt-6 pb-6">
      <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-3 sm:mb-4 gap-1 sm:gap-2 border border-black h-auto">
        <TabsTrigger value="model" className="flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 text-xs sm:text-sm cursor-pointer transition-colors duration-200 ease-in-out hover:bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:hover:bg-blue-700">
          <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Model Score
        </TabsTrigger>
        <TabsTrigger value="topic" className="flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 text-xs sm:text-sm cursor-pointer transition-colors duration-200 ease-in-out hover:bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:hover:bg-blue-700">
          <Library className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Topic
        </TabsTrigger>
        <TabsTrigger value="chart" className="flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 text-xs sm:text-sm cursor-pointer transition-colors duration-200 ease-in-out hover:bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:hover:bg-blue-700">
          <PieChart className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Topic Chart
        </TabsTrigger>
        <TabsTrigger value="network" className="flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 text-xs sm:text-sm cursor-pointer transition-colors duration-200 ease-in-out hover:bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:hover:bg-blue-700">
          <NetworkIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Network
        </TabsTrigger>
        <TabsTrigger value="cloud" className="flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 text-xs sm:text-sm cursor-pointer transition-colors duration-200 ease-in-out hover:bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:hover:bg-blue-700">
          <Cloud className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Word Cloud
        </TabsTrigger>
        <TabsTrigger value="interactive" className="flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 text-xs sm:text-sm cursor-pointer transition-colors duration-200 ease-in-out hover:bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:hover:bg-blue-700">
          <PlayCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Interactive
        </TabsTrigger>
      </TabsList>

      <TabsContent value="model" className="mt-3 sm:mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-300">
        <Card className="shadow-md">
          <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg font-semibold">Model Performance Scores</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Perplexity and Coherence scores for the generated LDA model.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:gap-4 p-3 sm:p-4">
            <div className="border-2 rounded-lg p-2 sm:p-3 bg-white">
              <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-1.5 sm:mb-2">Perplexity Score</h3>
              <div className="border w-full border-blue-500 rounded-lg h-64 sm:h-80 md:h-96 bg-slate-50 flex items-center justify-center text-gray-400 text-xs overflow-hidden">
                {perplexity_plot ? (
                  <img src={`data:image/png;base64,${perplexity_plot}`} alt="Perplexity Plot" className="w-full max-h-full object-fit object-center" />
                ) : (
                  <p>Perplexity Plot not available.</p>
                )}
              </div>
            </div>
            <div className="border-2 rounded-lg p-2 sm:p-3 bg-white">
              <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-1.5 sm:mb-2">Coherence Score</h3>
              <div className="border border-blue-500 rounded-lg h-64 sm:h-80 md:h-96 bg-slate-50 flex items-center justify-center text-gray-400 text-xs overflow-hidden">
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

      <TabsContent value="topic" className="mt-3 sm:mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-300">
        <Card className="shadow-md">
           <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg font-semibold">Topic Overview</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Keywords and details for each identified topic.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4">
            {ldaResponse.topics && ldaResponse.topics.length > 0 ? (
              [...ldaResponse.topics]
                .sort((a, b) => a.id - b.id)
                .map(topic => {
                  const keywords = parseKeywordsString(topic.id, topic.words);
                  return (
                    <div key={topic.id} className="border rounded-lg p-2.5 sm:p-3 bg-white">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-1.5 sm:mb-2 gap-1.5 sm:gap-0">
                        <h3 className="text-sm sm:text-base font-medium text-gray-700">Topic {topic.id}</h3>
                        <div className="flex items-center gap-1.5 sm:gap-2 self-start sm:self-center">
                          <Button variant="outline" size="sm" className="text-blue-600 border-blue-500 hover:bg-blue-50 hover:text-blue-700 h-7 sm:h-8 text-xs">
                            <Edit3 className="mr-1 h-3 w-3 sm:mr-1.5 sm:h-3.5 sm:w-3.5" />
                            Edit Keywords
                          </Button>
                          <span className="bg-blue-100 text-blue-700 text-xs rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 font-semibold">
                            {keywords.length} keywords
                          </span>
                        </div>
                      </div>
                      <div className="border rounded-md w-full min-h-[4rem] sm:min-h-[5rem] bg-slate-50 p-2 sm:p-3 text-gray-700 text-xs">
                        {keywords.length > 0 ? (
                          <div className="flex flex-wrap gap-1 sm:gap-1.5">
                            {keywords.map(kw => (
                              <div key={kw.id} className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs flex items-center shadow-sm">
                                <span>{kw.text}</span>
                                <span className="ml-1 text-blue-600 opacity-75 text-[0.6rem] sm:ml-1.5 sm:text-[0.65rem]">({kw.weight.toFixed(4)})</span>
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

      <TabsContent value="chart" className="mt-3 sm:mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-300">
        <Card className="shadow-md">
          <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg font-semibold">Topic Keyword Charts</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Visual representation of keyword weights within topics.</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2.5 mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-gray-200">
              <label htmlFor="chart-style-select" className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Chart Style:</label>
              <Select defaultValue="basic">
                <SelectTrigger className="w-full sm:w-[160px] md:w-[180px] h-8 sm:h-9 focus:ring-blue-500 text-xs sm:text-sm">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Style</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-8 sm:h-9 text-xs px-3 sm:px-4 self-start sm:self-center">
                <RefreshCw className="mr-1 h-3.5 w-3.5 sm:mr-1.5 sm:h-4 sm:w-4" />
                Apply
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {topic_images && topic_images.length > 0 ? (
                topic_images.map((topicImage, index) => (
                  <div key={topicImage.id || index} className="border border-black rounded-lg p-2 sm:p-3 bg-white">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-1.5 sm:mb-2 gap-1.5 sm:gap-0">
                      <h3 className="text-sm sm:text-base font-medium text-gray-700">Topic {index + 1} Chart</h3> 
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-blue-600 border-blue-500 hover:bg-blue-50 hover:text-blue-700 h-7 sm:h-8 text-xs self-start sm:self-center"
                        onClick={() => handleDownloadChart(topicImage.url)}
                        disabled={!topicImage.url}
                      >
                        <Download className="mr-1 h-3 w-3 sm:mr-1.5 sm:h-3.5 sm:w-3.5" />
                        Download
                      </Button>
                    </div>
                    <div className="border rounded-lg h-64 sm:h-72 md:h-80 bg-slate-50 flex items-center justify-center text-gray-400 text-xs overflow-hidden">
                      {topicImage.url ? (
                        <img 
                          src={topicImage.url.replace(/^http:\/\//i, 'https://')}
                          alt={`Topic ${index + 1} Chart`} 
                          className="w-full max-h-full object-fit object-center" 
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

      <TabsContent value="network" className="mt-3 sm:mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-300">
        <Card className="shadow-md">
          <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg font-semibold">Topic-Keyword Network</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Interactive network visualization of topics and their keywords.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-2">
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
            <div className="border border-blue-500 rounded-lg h-100 bg-slate-50 flex items-center justify-center text-gray-400 text-xs overflow-hidden">
              {network_img_url ? (
                <img 
                  src={network_img_url.replace(/^http:\/\//i, 'https://')}
                  alt="Topic-Keyword Network Visualization" 
                    className="w-full h-full object-fit object-center"
                  />
              ) : (
                <p>Network visualization not available.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="cloud" className="mt-3 sm:mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-300">
        <Card className="shadow-md">
          <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg font-semibold">Topic Word Clouds</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Word cloud representation for each identified topic.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4">
            {baseApiFilesUrl && wordcloud_paths && wordcloud_paths.length > 0 ? (
              wordcloud_paths.map(wc => {
                const imageUrl = `${baseApiFilesUrl}${wc.path}?download=false${sessionId ? `&session_id=${sessionId}` : ''}`.replace(/^http:\/\//i, 'https://');
                return (
                  <div key={wc.path || wc.topic_id} className="border-2 rounded-lg p-2 sm:p-3 bg-white">
                    <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-1.5 sm:mb-2 px-1">Topic {wc.topic_id + 1}</h3>
                    <div className="border border-blue-500 rounded-lg aspect-[4/3] bg-slate-50 flex items-center justify-center text-gray-400 text-xs overflow-hidden">
                      <img 
                        src={imageUrl} 
                        alt={`Word cloud for Topic ${wc.topic_id + 1}`} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="col-span-full text-center text-gray-500 py-4">
                {(!wordcloud_paths || wordcloud_paths.length === 0) ? "No word cloud data available." : "Could not determine image URLs for word clouds."}
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="interactive" className="mt-3 sm:mt-4 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-300">
        <Card className="shadow-md">
          <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg font-semibold">Interactive pyLDAvis</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Explore topics and keywords interactively with pyLDAvis.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-2">
            {pyldavis_html ? (
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={pyldavis_html}
                  className="w-full h-[600px] sm:h-[700px] md:h-[800px] border-0"
                  title="pyLDAvis Interactive Visualization"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            ) : (
              <p className="text-center text-gray-500 py-10">pyLDAvis visualization not available.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
} 
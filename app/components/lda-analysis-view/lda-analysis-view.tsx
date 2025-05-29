"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LDAKeywordEditor } from "../lda-keyword-editor/lda-keyword-editor";
import { LDATabs } from "../lda-tabs/lda-tabs";
import { LDAResponse } from "../../types/lda";
import { Card } from "@/components/ui/card";
import { Edit, LayoutDashboard } from "lucide-react";

interface LDAAnalysisViewTabsProps {
  ldaResponse: LDAResponse | null;
  onKeywordsUpdated: (updatedData: Partial<LDAResponse>) => void;
}

export function LDAAnalysisViewTabs({ ldaResponse, onKeywordsUpdated }: LDAAnalysisViewTabsProps) {
  if (!ldaResponse) {
    return (
      <div className="w-full max-w-5xl mt-6 flex items-center justify-center">
        <Card className="shadow-lg p-10">
          <p className="text-xl text-gray-600">LDA data not yet available. Please process data first.</p>
        </Card>
      </div>
    );
  }

  return (
    <Tabs defaultValue="editor" className="w-full max-w-5xl mt-2">
      <TabsList className="grid w-full grid-cols-2 mb-4 gap-2 h-auto bg-white border border-black dark:bg-slate-950 shadow-sm">
        <TabsTrigger 
          value="editor" 
          className="py-3 text-sm sm:text-base cursor-pointer transition-colors duration-200 ease-in-out bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:hover:bg-blue-700 data-[state=active]:shadow-inner"
        >
          <Edit className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Keyword Editor
        </TabsTrigger>
        <TabsTrigger 
          value="visualizations" 
          className="py-3 text-sm sm:text-base cursor-pointer transition-colors duration-200 ease-in-out bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:hover:bg-blue-700 data-[state=active]:shadow-inner"
        >
          <LayoutDashboard className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Visualizations
        </TabsTrigger>
      </TabsList>

      <TabsContent value="editor" className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-300">
        {/* LDAKeywordEditor expects ldaResponse to be non-null, which is guaranteed by the check above */}
        <LDAKeywordEditor ldaResponse={ldaResponse} onKeywordsUpdated={onKeywordsUpdated} />
      </TabsContent>
      <TabsContent value="visualizations" className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-300">
        <LDATabs ldaResponse={ldaResponse} />
      </TabsContent>
    </Tabs>
  );
} 
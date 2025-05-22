import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export interface LDAKeywordEditorProps {
  onNext: () => void;
}

export function LDAKeywordEditor({ onNext }: LDAKeywordEditorProps) {
  return (
    <div className="flex flex-col items-center gap-8 mt-12 w-full max-w-3xl">
      {/* Optimal Number of Topics */}
      <div className="w-full max-w-lg">
        <div className="text-base font-semibold mb-2">Analysis Result</div>
        <div className="border rounded-lg p-4 flex flex-col gap-4">
          <div className="font-medium text-sm mb-2">Optimal Number of Topics</div>
          <div className="flex items-center gap-2">
            <input type="number" value={8} className="border rounded px-2 py-1 w-20" readOnly />
            <Button variant="default" size="sm" className="flex items-center gap-1">
              Edit
              <span className="material-icons text-base">edit</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1 text-blue-700 border-blue-600">
              Apply
              <span className="material-icons text-base">refresh</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Keyword Editor */}
      <div className="w-full max-w-2xl">
        <div className="text-base font-semibold mb-2">Keyword Editor</div>
        <div className="border rounded-lg p-4 flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-4">
            <div>
              <div className="text-xs font-medium mb-1">Select Topic</div>
              <select className="border rounded px-2 py-1">
                <option>Topic 1</option>
                <option>Topic 2</option>
              </select>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1 text-blue-700 border-blue-600 mt-5">
              Apply
              <span className="material-icons text-base">refresh</span>
            </Button>
            <span className="ml-auto bg-gray-200 text-xs rounded-full px-3 py-1 font-medium">06 keywords</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2 w-12">S/N</th>
                  <th className="border-b p-2">Keyword</th>
                  <th className="border-b p-2 w-24">Weight</th>
                  <th className="border-b p-2 w-32">Action</th>
                </tr>
              </thead>
              <tbody>
                {[1,2,3,4,5,6].map(i => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="p-2">{String(i).padStart(2, '0')}</td>
                    <td className="p-2">Korean printing culture association</td>
                    <td className="p-2">0.0030</td>
                    <td className="p-2 flex gap-2">
                      <Button variant="default" size="sm" className="flex items-center gap-1 text-xs">
                        Edit
                        <span className="material-icons text-base">edit</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs text-blue-700 border-blue-600">
                        <span className="material-icons text-base">delete</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Button
        onClick={onNext}
        className="bg-blue-600 text-white rounded-full px-8 py-2 font-semibold shadow hover:bg-blue-700 transition-colors min-w-[180px]"
      >
        Proceed to Visualization
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
} 
import React, { useState } from "react";

export function LDATabs() {
  const [ldaTab, setLdaTab] = useState<'model'|'topic'|'chart'|'network'|'cloud'|'interactive'>('model');
  return (
    <div className="flex flex-col items-center gap-8 mt-12 w-full max-w-5xl">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setLdaTab('model')} className={`px-4 py-2 rounded border text-sm font-medium flex items-center gap-1 ${ldaTab === 'model' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 border-gray-300'}`}>
          <span className="material-icons text-base">bar_chart</span> Model Score
        </button>
        <button onClick={() => setLdaTab('topic')} className={`px-4 py-2 rounded border text-sm font-medium flex items-center gap-1 ${ldaTab === 'topic' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 border-gray-300'}`}>
          <span className="material-icons text-base">topic</span> Topic
        </button>
        <button onClick={() => setLdaTab('chart')} className={`px-4 py-2 rounded border text-sm font-medium flex items-center gap-1 ${ldaTab === 'chart' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 border-gray-300'}`}>
          <span className="material-icons text-base">insert_chart</span> Topic Chart
        </button>
        <button onClick={() => setLdaTab('network')} className={`px-4 py-2 rounded border text-sm font-medium flex items-center gap-1 ${ldaTab === 'network' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 border-gray-300'}`}>
          <span className="material-icons text-base">share</span> Network
        </button>
        <button onClick={() => setLdaTab('cloud')} className={`px-4 py-2 rounded border text-sm font-medium flex items-center gap-1 ${ldaTab === 'cloud' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 border-gray-300'}`}>
          <span className="material-icons text-base">cloud</span> Word Cloud
        </button>
        <button onClick={() => setLdaTab('interactive')} className={`px-4 py-2 rounded border text-sm font-medium flex items-center gap-1 ${ldaTab === 'interactive' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 border-gray-300'}`}>
          <span className="material-icons text-base">hourglass_empty</span> Interactive View
        </button>
      </div>
      {/* Model Score Tab Content */}
      {ldaTab === 'model' && (
        <div className="border rounded-xl p-8 w-full flex flex-col items-center">
          <div className="flex w-full gap-8">
            <div className="flex-1">
              <div className="font-medium mb-2">Perplexity Score</div>
              <div className="border rounded-lg h-64 bg-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium mb-2">Coherence Score</div>
              <div className="border rounded-lg h-64 bg-white" />
            </div>
          </div>
        </div>
      )}
      {/* Topic Tab Content */}
      {ldaTab === 'topic' && (
        <div className="border rounded-xl p-8 w-full flex flex-col gap-8">
          {[1, 2].map(topic => (
            <div key={topic} className="mb-4">
              <div className="flex items-center gap-4 mb-2">
                <span className="font-semibold">Topic 0{topic}</span>
                <button className="bg-blue-600 text-white rounded px-4 py-1 flex items-center gap-1 text-sm font-medium">
                  Edit Keyword
                  <span className="material-icons text-base">edit</span>
                </button>
                <span className="bg-gray-800 text-white text-xs rounded-full px-3 py-1 font-medium">40 keywords</span>
              </div>
              <div className="border rounded w-full h-32 bg-white" />
            </div>
          ))}
        </div>
      )}
      {/* Topic Chart Tab Content */}
      {ldaTab === 'chart' && (
        <div className="border rounded-xl p-8 w-full flex flex-col gap-6">
          <div className="mb-4">
            <div className="font-medium text-sm mb-2">Chart Style</div>
            <div className="flex items-center gap-2">
              <select className="border rounded px-2 py-1 text-gray-500" defaultValue="Basic Style">
                <option>Basic Style</option>
              </select>
              <button className="bg-blue-600 text-white rounded px-4 py-1 flex items-center gap-1 text-sm font-medium">
                Apply
                <span className="material-icons text-base">refresh</span>
              </button>
            </div>
          </div>
          <div className="flex gap-8 w-full">
            {[1, 2].map(topic => (
              <div key={topic} className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">Topic {topic} Keywords</span>
                  <button className="bg-gray-800 text-white rounded p-1 flex items-center" title="Download">
                    <span className="material-icons text-base">download</span>
                  </button>
                </div>
                <div className="border rounded-lg h-64 bg-white" />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Network Tab Content */}
      {ldaTab === 'network' && (
        <div className="border rounded-xl p-8 w-full flex flex-col gap-6">
          <div className="mb-4">
            <div className="font-medium text-sm mb-2">Visualization Style</div>
            <div className="flex items-center gap-2">
              <select className="border rounded px-2 py-1 text-gray-500" defaultValue="Academic">
                <option>Academic</option>
              </select>
              <button className="bg-blue-600 text-white rounded px-4 py-1 flex items-center gap-1 text-sm font-medium">
                Apply
                <span className="material-icons text-base">refresh</span>
              </button>
            </div>
          </div>
          <div>
            <div className="font-semibold text-sm mb-2">Topic-Keyword Network Visualization</div>
            <div className="border rounded-lg h-80 bg-white" />
          </div>
        </div>
      )}
      {/* Word Cloud Tab Content */}
      {ldaTab === 'cloud' && (
        <div className="border rounded-xl p-8 w-full flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(topic => (
              <div key={topic}>
                <div className="font-semibold mb-2">Topic {topic}</div>
                <div className="border rounded-lg h-48 bg-white" />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Interactive View Tab Content */}
      {ldaTab === 'interactive' && (
        <div className="border rounded-xl p-8 w-full flex flex-col gap-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="font-medium text-sm mr-2">Selected Topics</div>
            <input type="text" value="3" className="border rounded px-2 py-1 w-16 text-center" readOnly />
            <button className="border rounded p-1 flex items-center justify-center" title="Previous">
              <span className="material-icons text-base">chevron_left</span>
            </button>
            <button className="border rounded p-1 flex items-center justify-center" title="Next">
              <span className="material-icons text-base">chevron_right</span>
            </button>
            <button className="border rounded px-3 py-1 flex items-center gap-1 text-sm font-medium ml-2" title="Clear">
              Clear
              <span className="material-icons text-base">cancel</span>
            </button>
            <button className="bg-blue-600 text-white rounded px-4 py-1 flex items-center gap-1 text-sm font-medium ml-2">
              Apply
              <span className="material-icons text-base">refresh</span>
            </button>
          </div>
          <div>
            <div className="font-semibold text-sm mb-2">Topic-Keyword Network Visualization</div>
            <div className="border rounded-lg h-80 bg-white" />
          </div>
        </div>
      )}
    </div>
  );
} 
"use client";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebarState } from "./sidebar-state-context";
import { Menu } from 'lucide-react';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { currentSection, currentChild } = useSidebarState();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-blue-700 text-white flex flex-col p-4 pt-10 overflow-y-auto transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Menu Button (now part of sidebar, but could be moved outside for persistent visibility) */}
        <button
          onClick={toggleSidebar}
          className="md:hidden flex items-center gap-2 font-bold bg-white/100 text-blue-700 rounded-lg px-3 py-2 mb-6 hover:bg-white/90 transition-colors text-sm self-start"
        >
          <Image src="/menu_icon.png" alt="Menu" width={16} height={16} />
          Close Menu
        </button>
        {/* Navigation Sections */}
        <nav className="flex flex-col gap-5">
          {/* Data Collection Section */}
          <div className="flex flex-col gap-2">
            <div className={`flex items-center gap-2 font-medium px-2.5 py-1.5 rounded-lg transition-colors text-sm ${
              currentSection === "collection" ? "bg-white/20" : "hover:bg-white/10"
            }`}>
              <Image src="/data_collection_icon.png" alt="Data Collection" width={16} height={16} />
              Data Collection
              <span className="ml-auto">+</span>
            </div>
            
            {/* Data Collection Children */}
            <div className="ml-4 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 relative px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-sm">
                <Image src="/user_data_upload_icon.png" alt="User Data Upload" width={16} height={16} />
                User Data Upload
                <span className="ml-auto">+</span>
                {currentChild === "user_data_upload" && (
                  <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full border-2 border-blue-700 shadow-[0_0_8px_2px_rgba(255,255,255,0.7)] animate-twinkle" />
                )}
              </div>

              {/* Upload Section */}
              <div className="ml-4 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 relative px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-sm">
                  <Image src="/upload_icon.png" alt="Upload" width={16} height={16} />
                  Upload
                  {currentChild === "upload" && (
                    <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full border-2 border-blue-700 shadow-[0_0_8px_2px_rgba(255,255,255,0.7)] animate-twinkle" />
                  )}
                </div>
                <div className="flex items-center gap-2 relative px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-sm">
                  <Image src="/select_column_icon.png" alt="Select Column" width={16} height={16} />
                  Select Column
                  {currentChild === "select-column" && (
                    <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full border-2 border-blue-700 shadow-[0_0_8px_2px_rgba(255,255,255,0.7)] animate-twinkle" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/20" />

          {/* Data Preprocessing Section */}
          <div className="flex flex-col gap-2">
            <div className={`flex items-center gap-2 font-medium px-2.5 py-1.5 rounded-lg transition-colors text-sm ${
              currentSection === "preprocessing" ? "bg-white/20" : "hover:bg-white/10"
            }`}>
              <Image src="/data_processing_icon.png" alt="Data Preprocessing" width={16} height={16} />
              Data Preprocessing
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/20" />

          {/* Data Analysis Section */}
          <div className="flex flex-col gap-2">
            <div className={`flex items-center gap-2 font-medium px-2.5 py-1.5 rounded-lg transition-colors text-sm ${
              currentSection === "analysis" ? "bg-white/20" : "hover:bg-white/10"
            }`}>
              <Image src="/data_analysis_icon.png" alt="Data Analysis" width={16} height={16} />
              Data Analysis
              <span className="ml-auto">+</span>
            </div>

            {/* Analysis Children */}
            <div className="ml-4 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 relative px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-sm">
                <Image src="/word_frequency_icon.png" alt="Word Frequency" width={16} height={16} />
                Word Frequency
                {currentChild === "word_frequency" && (
                  <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full border-2 border-blue-700 shadow-[0_0_8px_2px_rgba(255,255,255,0.7)] animate-twinkle" />
                )}
              </div>
              <div className="flex items-center gap-2 relative px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-sm">
                <Image src="/lda_icon.png" alt="LDA" width={16} height={16} />
                LDA
                {currentChild === "lda" && (
                  <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full border-2 border-blue-700 shadow-[0_0_8px_2px_rgba(255,255,255,0.7)] animate-twinkle" />
                )}
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 bg-white overflow-y-auto p-4 sm:p-6 md:p-8 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'md:ml-64' : 'md:ml-64'
        }`}
      >
        {/* Hamburger Menu Button for mobile - placed in main content area for visibility */}
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-700 text-white rounded-md hover:bg-blue-600 transition-colors"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <Menu className="h-5 w-5 mt-6 bg-white text-blue-700" /> : <Menu className="h-5 w-5" />}
        </button>
        {children}
      </main>
    </div>
  );
} 
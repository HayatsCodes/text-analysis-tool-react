"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type SidebarSection = "collection" | "preprocessing" | "analysis" | null;
export type SidebarChild = "user_data_upload" | "upload" | "select-column" | "word_frequency" | "lda" | null;

interface SidebarStateContextProps {
  currentSection: SidebarSection;
  currentChild: SidebarChild;
  setCurrentSection: (section: SidebarSection) => void;
  setCurrentChild: (child: SidebarChild) => void;
}

const SidebarStateContext = createContext<SidebarStateContextProps | undefined>(undefined);

export function SidebarStateProvider({ children }: { children: React.ReactNode }) {
  const [currentSection, setCurrentSection] = useState<SidebarSection>("collection");
  const [currentChild, setCurrentChild] = useState<SidebarChild>("user_data_upload");

  // Update state based on URL on mount and URL changes
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/lda")) {
      setCurrentSection("analysis");
      setCurrentChild("lda");
    } else if (path.startsWith("/analysis")) {
      setCurrentSection("analysis");
      setCurrentChild("word_frequency");
    } else if (path.startsWith("/preprocessing")) {
      setCurrentSection("preprocessing");
      setCurrentChild(null);
    } else {
      setCurrentSection("collection");
      setCurrentChild("user_data_upload");
    }
  }, []);

  return (
    <SidebarStateContext.Provider 
      value={{ 
        currentSection, 
        currentChild, 
        setCurrentSection, 
        setCurrentChild 
      }}
    >
      {children}
    </SidebarStateContext.Provider>
  );
}

export function useSidebarState() {
  const ctx = useContext(SidebarStateContext);
  if (!ctx) throw new Error("useSidebarState must be used within SidebarStateProvider");
  return ctx;
} 
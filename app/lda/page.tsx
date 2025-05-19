"use client";

import React, { useEffect } from "react";
import { LDATabs } from "../components/lda-tabs/lda-tabs";
import { useSidebarState } from "../components/sidebar-layout/sidebar-state-context";

export default function LDAPage() {
  const { setCurrentSection, setCurrentChild } = useSidebarState();

  useEffect(() => {
    setCurrentSection("analysis");
    setCurrentChild("lda");
  }, [setCurrentSection, setCurrentChild]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <LDATabs />
    </div>
  );
} 
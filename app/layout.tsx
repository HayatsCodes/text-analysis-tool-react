import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { SidebarLayout } from "./components/sidebar-layout/sidebar-layout";
import { SidebarStateProvider } from "./components/sidebar-layout/sidebar-state-context";
import { Toaster } from 'react-hot-toast';
import { FileProvider } from "./contexts/file-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Text analysis tool",
  description: "Text analysis tool",
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    "google-fonts": "https://fonts.googleapis.com/icon?family=Material+Icons",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <FileProvider>
          <SidebarStateProvider>
            <SidebarLayout>{children}</SidebarLayout>
          </SidebarStateProvider>
        </FileProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              style: {
                background: '#22c55e',
                color: 'white',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#22c55e',
              },
            },
            error: {
              style: {
                background: '#ef4444',
                color: 'white',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#ef4444',
              },
            },
            loading: {
              style: {
                background: '#3b82f6',
                color: 'white',
              },
            },
          }}
        />
      </body>
    </html>
  );
}

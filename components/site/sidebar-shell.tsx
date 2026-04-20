"use client";

import React, { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DASHBOARD_TOPICS } from "@/lib/fred/topics-config";
import { PageWrapper } from "@/components/ui/animations";
import { AnimatePresence } from "framer-motion";

export function SidebarShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const newState = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("zemen_sidebar", String(newState));
      }
      return newState;
    });
  };

  // Restore preference on load
  useEffect(() => {
    queueMicrotask(() => {
      setIsMounted(true);
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("zemen_sidebar");
        if (saved !== null) {
          setSidebarOpen(saved === "true");
        }
      }
    });
  }, []);

  // Keyboard shortcut [
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        e.key === "[" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !(e.target as Element).matches("input, textarea")
      ) {
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // To avoid hydration mismatch if localStorage differs from default
  if (!isMounted) {
    return (
      <div className="flex min-h-screen flex-col bg-[#050505] text-zinc-100 lg:flex-row">
        <DashboardSidebar topics={DASHBOARD_TOPICS} />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-[#080808]">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#050505",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? "264px" : "0px", // Adjusted to match DashboardSidebar width
          minWidth: sidebarOpen ? "264px" : "0px",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
          borderRight: sidebarOpen ? "1px solid #0f0f0f" : "none",
          background: "#050505",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <DashboardSidebar topics={DASHBOARD_TOPICS} />
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          overflow: "auto",
          position: "relative",
          transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
          background: "#080808",
        }}
      >
        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: "50%",
            left: sidebarOpen ? "252px" : "8px", // Adjusted based on 264px width - 12px padding or similar
            transform: "translateY(-50%)",
            zIndex: 100,
            width: "24px",
            height: "48px",
            background: "#0d0d0d",
            border: "1px solid #141414",
            borderRadius: "0 6px 6px 0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#444",
            fontSize: "20px",
            transition: "left 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#111";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = "#1e1e1e";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#0d0d0d";
            e.currentTarget.style.color = "#444";
            e.currentTarget.style.borderColor = "#141414";
          }}
          title={
            sidebarOpen ? "Hide sidebar  [  " : "Show sidebar  [  "
          }
        >
          {sidebarOpen ? "‹" : "›"}
        </button>

        <AnimatePresence mode="wait">
          <PageWrapper key="page-content">{children}</PageWrapper>
        </AnimatePresence>
      </main>
    </div>
  );
}

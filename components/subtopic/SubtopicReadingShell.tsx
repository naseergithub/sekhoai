"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import SubtopicMobileToolbar from "@/components/subtopic/SubtopicMobileToolbar";
import type { TocSection } from "@/components/subtopic/TableOfContents";
import type { SidebarProps } from "@/lib/sidebar";

type SubtopicReadingShellProps = {
  sidebarProps: SidebarProps;
  tocSections: TocSection[];
  shareTitle: string;
  pageUrl: string;
  children: React.ReactNode;
};

export default function SubtopicReadingShell({
  sidebarProps,
  tocSections,
  shareTitle,
  pageUrl,
  children,
}: SubtopicReadingShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <section className="bg-slate-50 py-8 dark:bg-slate-950 lg:py-10">
        <div className="container-public">
          {/* Full-width reading column — no sidebars on desktop */}
          <div className="w-full min-w-0">
            {children}
          </div>
        </div>
      </section>

      {/* Course menu: mobile drawer only */}
      <Sidebar
        {...sidebarProps}
        hideDesktop
        hideMobileTrigger
        mobileOpen={sidebarOpen}
        onMobileOpenChange={setSidebarOpen}
      />

      <SubtopicMobileToolbar
        title={shareTitle}
        pageUrl={pageUrl}
        tocSections={tocSections}
        onOpenSidebar={() => setSidebarOpen(true)}
      />
    </>
  );
}

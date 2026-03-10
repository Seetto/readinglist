"use client";

import { ReadingListProvider } from "@/app/context/ReadingListContext";
import { ReadingListSidebar } from "@/app/components/ReadingListSidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReadingListProvider>
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="flex-1 min-w-0">{children}</div>
        <ReadingListSidebar />
      </div>
    </ReadingListProvider>
  );
}

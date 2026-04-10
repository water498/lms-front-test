"use client";

import TopHeader from "./top-header";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}

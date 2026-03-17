"use client";

import PlatformAdminSidebar from "./sidebar";
import PlatformAdminTopbar from "./topbar";

export default function PlatformAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <PlatformAdminSidebar />
      <PlatformAdminTopbar />
      <main className="ml-60 pt-14 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

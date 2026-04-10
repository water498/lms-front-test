"use client";

import BackofficeSidebarV2 from "./sidebar-v2";
import TopHeader from "./top-header";

export default function BackofficeLayoutV2({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopHeader />
      <BackofficeSidebarV2 />
      <main className="ml-60 pt-14 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

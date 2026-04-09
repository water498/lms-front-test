"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PlatformAdminSidebar from "./sidebar";
import PlatformAdminTopbar from "./topbar";
import { usePlatformAdminAuthStore } from "../shared/auth-store";

export default function PlatformAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn } = usePlatformAdminAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return <div className="min-h-screen bg-slate-50" />;

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

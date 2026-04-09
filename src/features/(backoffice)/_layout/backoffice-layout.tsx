"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BackofficeSidebar from "./sidebar";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn, role } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }
    // Backoffice는 ORG_ADMIN, INSTRUCTOR, SUPER_ADMIN만 접근 가능
    if (role === "LEARNER") {
      router.replace("/student");
    }
  }, [isLoggedIn, role, router]);

  if (!isLoggedIn || role === "LEARNER") {
    return <div className="min-h-screen bg-slate-50" />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <BackofficeSidebar />
      <main className="ml-60 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

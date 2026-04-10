"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function BackofficeAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn, role } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }
    if (role === "LEARNER") {
      router.replace("/student");
    }
  }, [isLoggedIn, role, router]);

  if (!isLoggedIn || role === "LEARNER") {
    return <div className="min-h-screen bg-slate-50" />;
  }

  return <>{children}</>;
}

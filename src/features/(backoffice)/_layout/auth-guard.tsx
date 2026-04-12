"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function BackofficeAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn, role } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  // Zustand persist hydration 완료 대기
  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    // 이미 hydration 완료된 경우
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }
    if (role === "LEARNER") {
      router.replace("/student");
    }
  }, [hydrated, isLoggedIn, role, router]);

  if (!hydrated || !isLoggedIn || role === "LEARNER") {
    return <div className="min-h-screen bg-slate-50" />;
  }

  return <>{children}</>;
}

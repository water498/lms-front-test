"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/features/(backoffice)/shared/auth-store";

function LayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn } = useAdminAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/backoffice/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return <div className="min-h-screen bg-slate-50" />;

  return <div className="min-h-screen bg-white">{children}</div>;
}

export default function AdminFullscreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <LayoutInner>{children}</LayoutInner>
    </Suspense>
  );
}

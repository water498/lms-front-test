"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import ImpersonationBanner from "./impersonation-banner";
import { useAdminAuthStore } from "../shared/auth-store";

function LayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn } = useAdminAuthStore();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("impersonateTenantId");
  const tenantName = searchParams.get("impersonateTenantName") ?? "";
  const isImpersonating = !!tenantId;

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="min-h-screen bg-slate-50">
      {isImpersonating && (
        <ImpersonationBanner tenantId={tenantId!} tenantName={tenantName} />
      )}
      <Sidebar isImpersonating={isImpersonating} />
      <Topbar isImpersonating={isImpersonating} />
      <main
        className={`ml-60 min-h-screen ${isImpersonating ? "pt-23" : "pt-14"}`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <LayoutInner>{children}</LayoutInner>
    </Suspense>
  );
}

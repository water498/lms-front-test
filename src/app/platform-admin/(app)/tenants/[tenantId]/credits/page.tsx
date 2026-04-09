"use client";

import MessagingCreditSection from "@/features/(platform-admin)/tenant-credits/feature";
import { useTenantDetail } from "@/features/(platform-admin)/tenant-layout/context";

export default function Page() {
  const { tenant } = useTenantDetail();
  return <MessagingCreditSection tenantId={tenant.id} />;
}

"use client";

import MessagingCreditSection from "@/features/(platform-admin)/tenant-detail/sections/messaging-credit-section";
import { useTenantDetail } from "@/features/(platform-admin)/tenant-detail/context";

export default function Page() {
  const { tenant } = useTenantDetail();
  return <MessagingCreditSection tenantId={tenant.id} />;
}

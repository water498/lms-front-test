"use client";

import SsoSection from "@/features/(platform-admin)/tenant-detail/sections/sso-section";
import { useTenantDetail } from "@/features/(platform-admin)/tenant-detail/context";

export default function Page() {
  const { tenant } = useTenantDetail();
  return <SsoSection tenant={tenant} />;
}

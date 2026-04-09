"use client";

import SsoSection from "@/features/(platform-admin)/tenant-sso/feature";
import { useTenantDetail } from "@/features/(platform-admin)/tenant-layout/context";

export default function Page() {
  const { tenant } = useTenantDetail();
  return <SsoSection tenant={tenant} />;
}

"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import {
  TENANTS,
  PLATFORM_DOMAIN,
  validateSubdomain,
  type TenantStatus,
  type SubdomainStatus,
} from "../tenants/mockData";
import type { Tenant } from "@/lib/models";

interface TenantDetailContextValue {
  tenant: Tenant;
  tenantId: string;
  localStatus: TenantStatus;
  setLocalStatus: Dispatch<SetStateAction<TenantStatus>>;
  localSubdomain: string;
  setLocalSubdomain: Dispatch<SetStateAction<string>>;
  existingSubdomains: string[];
  platformDomain: string;
}

const TenantDetailContext = createContext<TenantDetailContextValue | null>(null);

export function useTenantDetail() {
  const ctx = useContext(TenantDetailContext);
  if (!ctx) throw new Error("useTenantDetail must be used within TenantDetailProvider");
  return ctx;
}

export function TenantDetailProvider({
  tenantId,
  children,
}: {
  tenantId: string;
  children: ReactNode;
}) {
  const tenant = TENANTS.find((t) => t.id === tenantId);

  const [localStatus, setLocalStatus] = useState<TenantStatus>(
    tenant?.status ?? "ACTIVE",
  );
  const [localSubdomain, setLocalSubdomain] = useState(tenant?.subdomain ?? "");

  const existingSubdomains = useMemo(() => TENANTS.map((t) => t.subdomain), []);

  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  return (
    <TenantDetailContext.Provider
      value={{
        tenant,
        tenantId,
        localStatus,
        setLocalStatus,
        localSubdomain,
        setLocalSubdomain,
        existingSubdomains,
        platformDomain: PLATFORM_DOMAIN,
      }}
    >
      {children}
    </TenantDetailContext.Provider>
  );
}

import { create } from "zustand";
import { type TenantContext, type TenantType } from "@/lib/models";

const B2C_MOCK: TenantContext = {
  tenantId: "platform",
  tenantType: "B2C",
  tenantName: "OpenKnock",
  features: {
    payments: true,
    cart: true,
    orgStructure: false,
    sso: false,
    mandatoryCourses: false,
  },
};

const B2B_MOCK: TenantContext = {
  tenantId: "t1",
  tenantType: "B2B",
  tenantName: "삼성전자",
  features: {
    payments: false,
    cart: false,
    orgStructure: true,
    sso: true,
    mandatoryCourses: true,
  },
};

interface TenantContextStore {
  tenant: TenantContext;
  switchTenant: (type: TenantType) => void;
}

export const useTenantContextStore = create<TenantContextStore>((set) => ({
  tenant: B2B_MOCK,
  switchTenant: (type) => set({ tenant: type === "B2C" ? B2C_MOCK : B2B_MOCK }),
}));

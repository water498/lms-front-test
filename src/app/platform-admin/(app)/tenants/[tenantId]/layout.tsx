import TenantDetailShell from "@/features/(platform-admin)/tenant-layout/feature";

export default function TenantDetailLayout({ children }: { children: React.ReactNode }) {
  return <TenantDetailShell>{children}</TenantDetailShell>;
}

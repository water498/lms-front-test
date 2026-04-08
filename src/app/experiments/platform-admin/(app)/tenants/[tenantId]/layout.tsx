import TenantDetailShell from "@/features/(platform-admin)/tenant-detail/shell";

export default function TenantDetailLayout({ children }: { children: React.ReactNode }) {
  return <TenantDetailShell>{children}</TenantDetailShell>;
}

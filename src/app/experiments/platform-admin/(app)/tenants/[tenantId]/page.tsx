import TenantDetailFeature from "@/features/(platform-admin)/tenant-detail/feature";

interface Props {
  params: Promise<{ tenantId: string }>;
}

export default async function Page({ params }: Props) {
  const { tenantId } = await params;
  return <TenantDetailFeature tenantId={tenantId} />;
}

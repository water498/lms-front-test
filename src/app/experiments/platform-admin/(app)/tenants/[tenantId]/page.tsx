import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ tenantId: string }>;
}

export default async function Page({ params }: Props) {
  const { tenantId } = await params;
  redirect(`/experiments/platform-admin/tenants/${tenantId}/overview`);
}

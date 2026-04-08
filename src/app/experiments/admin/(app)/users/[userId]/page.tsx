import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function Page({ params }: Props) {
  const { userId } = await params;
  redirect(`/experiments/admin/users/${userId}/profile`);
}

import UserDetailFeature from "@/features/(admin)/users/user-detail/feature";

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function Page({ params }: Props) {
  const { userId } = await params;
  return <UserDetailFeature userId={userId} />;
}

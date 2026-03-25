import Feature from "@/features/(student)/courses/feature";

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function Page({ params }: Props) {
  const { courseId } = await params;
  return <Feature courseId={courseId} />;
}

import Feature from "@/features/(b2b-student)/courses/feature";

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function Page({ params }: Props) {
  const { courseId } = await params;
  return <Feature courseId={courseId} />;
}

import LearnFeature from "@/features/(b2c-student)/learn/feature";

interface Props {
  params: Promise<{ courseId: string; activityId: string }>;
}

export default async function Page({ params }: Props) {
  const { courseId, activityId } = await params;
  return <LearnFeature courseId={courseId} activityId={activityId} />;
}

import LearnFeature from "@/features/(student)/learning-player/feature";

interface Props {
  params: Promise<{ courseId: string; activityId: string }>;
}

export default async function Page({ params }: Props) {
  const { courseId, activityId } = await params;
  return <LearnFeature courseId={courseId} activityId={activityId} />;
}

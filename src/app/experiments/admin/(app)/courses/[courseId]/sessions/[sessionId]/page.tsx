import SessionDetailFeature from "@/features/(admin)/session-detail/feature";

interface Props {
  params: Promise<{ courseId: string; sessionId: string }>;
}

export default async function Page({ params }: Props) {
  const { courseId, sessionId } = await params;
  return <SessionDetailFeature courseId={courseId} sessionId={sessionId} />;
}

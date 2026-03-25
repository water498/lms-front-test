import InstructorSessionDetailFeature from "@/features/(instructor)/session-detail/feature";

export default async function Page({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <InstructorSessionDetailFeature sessionId={sessionId} />;
}

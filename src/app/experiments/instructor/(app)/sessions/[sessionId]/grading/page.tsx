import GradingTab from "@/features/(instructor)/course-session-grading/feature";

export default async function Page({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <GradingTab sessionId={sessionId} />;
}

import GradingTab from "@/features/(instructor)/session-detail/tabs/grading-tab";

export default async function Page({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <GradingTab sessionId={sessionId} />;
}

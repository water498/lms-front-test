import StudentsTab from "@/features/(instructor)/session-layout/tabs/students-tab";

export default async function Page({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <StudentsTab sessionId={sessionId} />;
}

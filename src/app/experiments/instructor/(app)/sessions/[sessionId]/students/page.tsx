import StudentsTab from "@/features/(instructor)/course-session-student-list/feature";

export default async function Page({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <StudentsTab sessionId={sessionId} />;
}

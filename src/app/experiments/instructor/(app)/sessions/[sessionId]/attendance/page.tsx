import AttendanceTab from "@/features/(instructor)/course-session-attendance/feature";

export default async function Page({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <AttendanceTab sessionId={sessionId} />;
}

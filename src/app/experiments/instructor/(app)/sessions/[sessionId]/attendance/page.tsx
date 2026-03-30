import AttendanceTab from "@/features/(instructor)/session-detail/tabs/attendance-tab";

export default async function Page({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <AttendanceTab sessionId={sessionId} />;
}

import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  redirect(`/instructor/sessions/${sessionId}/students`);
}

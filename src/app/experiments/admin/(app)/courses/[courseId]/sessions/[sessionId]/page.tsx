import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ courseId: string; sessionId: string }>;
}

export default async function Page({ params }: Props) {
  const { courseId, sessionId } = await params;
  redirect(`/experiments/admin/courses/${courseId}/sessions/${sessionId}/dashboard`);
}

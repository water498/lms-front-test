import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ courseId: string; sessionId: string }>;
}

export default async function Page({ params }: Props) {
  const { courseId, sessionId } = await params;
  redirect(`/backoffice/courses/${courseId}/sessions/${sessionId}/dashboard`);
}

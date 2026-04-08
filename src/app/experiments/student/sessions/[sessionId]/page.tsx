import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function Page({ params }: Props) {
  const { sessionId } = await params;
  redirect(`/experiments/student/sessions/${sessionId}/home`);
}

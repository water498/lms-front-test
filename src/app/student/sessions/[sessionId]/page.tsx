import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function Page({ params }: Props) {
  const { sessionId } = await params;
  redirect(`/student/sessions/${sessionId}/home`);
}

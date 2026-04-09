import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function Page({ params }: Props) {
  const { courseId } = await params;
  redirect(`/student/courses/${courseId}/intro`);
}

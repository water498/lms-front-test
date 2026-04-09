import ExamEditorFeature from "@/features/(admin)/assessment-exam-editor/feature";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <ExamEditorFeature examId={id} />;
}

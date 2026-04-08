import AssignmentEditorFeature from "@/features/(admin)/assessment-assignment-editor/feature";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <AssignmentEditorFeature assignmentId={id} />;
}

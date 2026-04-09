import SurveyEditorFeature from "@/features/(backoffice)/assessment-survey-editor/feature";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <SurveyEditorFeature surveyId={id} />;
}

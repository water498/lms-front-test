import SessionWorkspaceFeature from "@/features/(student)/session-workspace/feature";

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function SessionWorkspacePage({ params }: Props) {
  const { sessionId } = await params;
  return <SessionWorkspaceFeature sessionId={sessionId} />;
}

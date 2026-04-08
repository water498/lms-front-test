import SessionWorkspaceShell from "@/features/(student)/session-layout/feature";

export default function SessionWorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <SessionWorkspaceShell>{children}</SessionWorkspaceShell>;
}

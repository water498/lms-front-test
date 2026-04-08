import SessionWorkspaceShell from "@/features/(student)/session-workspace/shell";

export default function SessionWorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <SessionWorkspaceShell>{children}</SessionWorkspaceShell>;
}

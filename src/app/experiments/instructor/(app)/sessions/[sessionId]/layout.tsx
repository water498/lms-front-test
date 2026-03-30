import SessionShell from "@/features/(instructor)/session-detail/shell";

export default function SessionLayout({ children }: { children: React.ReactNode }) {
  return <SessionShell>{children}</SessionShell>;
}

import SessionShell from "@/features/(instructor)/session-layout/feature";

export default function SessionLayout({ children }: { children: React.ReactNode }) {
  return <SessionShell>{children}</SessionShell>;
}

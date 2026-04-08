import SessionDetailShell from "@/features/(admin)/session-detail/shell";

export default function SessionDetailLayout({ children }: { children: React.ReactNode }) {
  return <SessionDetailShell>{children}</SessionDetailShell>;
}

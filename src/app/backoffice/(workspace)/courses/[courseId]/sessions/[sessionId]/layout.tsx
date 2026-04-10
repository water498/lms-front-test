import SessionDetailShellV2 from "@/features/(backoffice)/v2-session-layout/feature";

export default function SessionLayout({ children }: { children: React.ReactNode }) {
  return <SessionDetailShellV2>{children}</SessionDetailShellV2>;
}

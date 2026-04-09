import UserDetailShell from "@/features/(backoffice)/user-layout/feature";

export default function UserDetailLayout({ children }: { children: React.ReactNode }) {
  return <UserDetailShell>{children}</UserDetailShell>;
}

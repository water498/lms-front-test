import UserDetailShell from "@/features/(admin)/user-layout/feature";

export default function UserDetailLayout({ children }: { children: React.ReactNode }) {
  return <UserDetailShell>{children}</UserDetailShell>;
}

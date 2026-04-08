import UserDetailShell from "@/features/(admin)/user-detail/shell";

export default function UserDetailLayout({ children }: { children: React.ReactNode }) {
  return <UserDetailShell>{children}</UserDetailShell>;
}

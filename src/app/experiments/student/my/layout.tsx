import MyShell from "@/features/(student)/my-page-layout/my-shell";

export default function MyLayout({ children }: { children: React.ReactNode }) {
  return <MyShell>{children}</MyShell>;
}

import MyShell from "@/features/(student)/my/my-shell";

export default function MyLayout({ children }: { children: React.ReactNode }) {
  return <MyShell>{children}</MyShell>;
}

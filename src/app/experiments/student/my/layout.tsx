import MyShell from "@/features/(student)/mypage-layout/feature";

export default function MyLayout({ children }: { children: React.ReactNode }) {
  return <MyShell>{children}</MyShell>;
}

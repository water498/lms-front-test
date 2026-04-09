import AdminFullscreenLayout from "@/features/(backoffice)/_layout/fullscreen-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminFullscreenLayout>{children}</AdminFullscreenLayout>;
}

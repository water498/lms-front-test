import AdminFullscreenLayout from "@/features/(admin)/_layout/admin-fullscreen-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminFullscreenLayout>{children}</AdminFullscreenLayout>;
}

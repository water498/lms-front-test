import BackofficeAuthGuard from "@/features/(backoffice)/_layout/auth-guard";

export default function BackofficeRootLayout({ children }: { children: React.ReactNode }) {
  return <BackofficeAuthGuard>{children}</BackofficeAuthGuard>;
}

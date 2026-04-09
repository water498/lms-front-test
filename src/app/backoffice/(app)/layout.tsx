import BackofficeLayout from "@/features/(backoffice)/_layout/backoffice-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BackofficeLayout>{children}</BackofficeLayout>;
}

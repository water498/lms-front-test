// v1: import BackofficeLayout from "@/features/(backoffice)/_layout/backoffice-layout";
import BackofficeLayoutV2 from "@/features/(backoffice)/_layout/backoffice-layout-v2";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BackofficeLayoutV2>{children}</BackofficeLayoutV2>;
}

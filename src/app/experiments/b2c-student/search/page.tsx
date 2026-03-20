import { Suspense } from "react";
import SearchFeature from "@/features/(b2c-student)/search/feature";

export default function Page() {
  return (
    <Suspense>
      <SearchFeature />
    </Suspense>
  );
}

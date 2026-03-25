import { Suspense } from "react";
import SearchFeature from "@/features/(student)/search/feature";

export default function Page() {
  return (
    <Suspense>
      <SearchFeature />
    </Suspense>
  );
}

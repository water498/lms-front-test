import { Suspense } from "react";
import SearchFeature from "@/features/(student)/course-search/feature";

export default function Page() {
  return (
    <Suspense>
      <SearchFeature />
    </Suspense>
  );
}

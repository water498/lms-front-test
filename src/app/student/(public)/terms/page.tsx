import { Suspense } from "react";
import TermsFeature from "@/features/(student)/legal-terms/feature";

export default function Page() {
  return (
    <Suspense>
      <TermsFeature />
    </Suspense>
  );
}

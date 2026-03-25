import { Suspense } from "react";
import CheckoutSuccessFeature from "@/features/(student)/checkout/success";

export default function Page() {
  return (
    <Suspense>
      <CheckoutSuccessFeature />
    </Suspense>
  );
}

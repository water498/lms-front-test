import { Suspense } from "react";
import CheckoutSuccessFeature from "@/features/(student)/payment-checkout/success";

export default function Page() {
  return (
    <Suspense>
      <CheckoutSuccessFeature />
    </Suspense>
  );
}

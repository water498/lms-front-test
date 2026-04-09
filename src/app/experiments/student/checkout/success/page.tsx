import { Suspense } from "react";
import CheckoutSuccessFeature from "@/features/(student)/payment-checkout/sections/success";

export default function Page() {
  return (
    <Suspense>
      <CheckoutSuccessFeature />
    </Suspense>
  );
}

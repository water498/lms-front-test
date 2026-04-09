import { Suspense } from "react";
import CheckoutFailureFeature from "@/features/(student)/payment-checkout/sections/failure";

export default function Page() {
  return (
    <Suspense>
      <CheckoutFailureFeature />
    </Suspense>
  );
}

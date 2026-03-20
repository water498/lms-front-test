import { Suspense } from "react";
import CheckoutSuccessFeature from "@/features/(b2c-student)/checkout/success";

export default function Page() {
  return (
    <Suspense>
      <CheckoutSuccessFeature />
    </Suspense>
  );
}

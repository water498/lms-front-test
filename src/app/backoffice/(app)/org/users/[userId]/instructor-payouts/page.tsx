"use client";

import InstructorPayoutsTab from "@/features/(backoffice)/user-instructor-payouts/feature";
import { useUserDetail } from "@/features/(backoffice)/user-layout/context";

export default function Page() {
  const { instRevenues } = useUserDetail();
  return <InstructorPayoutsTab revenues={instRevenues} />;
}

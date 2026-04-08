"use client";

import InstructorPayoutsTab from "@/features/(admin)/user-instructor-payouts/feature";
import { useUserDetail } from "@/features/(admin)/user-layout/context";

export default function Page() {
  const { instRevenues } = useUserDetail();
  return <InstructorPayoutsTab revenues={instRevenues} />;
}

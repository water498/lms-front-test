"use client";

import InstructorPayoutsTab from "@/features/(admin)/user-detail/tabs/instructor-payouts-tab";
import { useUserDetail } from "@/features/(admin)/user-detail/context";

export default function Page() {
  const { instRevenues } = useUserDetail();
  return <InstructorPayoutsTab revenues={instRevenues} />;
}

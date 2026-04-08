"use client";

import InstructorPayoutsTab from "@/features/(admin)/user-layout/tabs/instructor-payouts-tab";
import { useUserDetail } from "@/features/(admin)/user-layout/context";

export default function Page() {
  const { instRevenues } = useUserDetail();
  return <InstructorPayoutsTab revenues={instRevenues} />;
}

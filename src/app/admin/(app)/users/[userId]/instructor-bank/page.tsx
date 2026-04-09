"use client";

import InstructorBankTab from "@/features/(admin)/user-instructor-bank/feature";
import { useUserDetail } from "@/features/(admin)/user-layout/context";

export default function Page() {
  const { instBankAccounts, userId } = useUserDetail();
  return <InstructorBankTab accounts={instBankAccounts} instructorId={userId} />;
}

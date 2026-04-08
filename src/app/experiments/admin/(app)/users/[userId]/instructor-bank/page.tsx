"use client";

import InstructorBankTab from "@/features/(admin)/user-detail/tabs/instructor-bank-tab";
import { useUserDetail } from "@/features/(admin)/user-detail/context";

export default function Page() {
  const { instBankAccounts, userId } = useUserDetail();
  return <InstructorBankTab accounts={instBankAccounts} instructorId={userId} />;
}

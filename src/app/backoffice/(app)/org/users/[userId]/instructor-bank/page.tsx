"use client";

import InstructorBankTab from "@/features/(backoffice)/user-instructor-bank/feature";
import { useUserDetail } from "@/features/(backoffice)/user-layout/context";

export default function Page() {
  const { instBankAccounts, userId } = useUserDetail();
  return <InstructorBankTab accounts={instBankAccounts} instructorId={userId} />;
}

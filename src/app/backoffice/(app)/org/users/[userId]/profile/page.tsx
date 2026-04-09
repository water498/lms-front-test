"use client";

import ProfileTab from "@/features/(backoffice)/user-profile/feature";
import { useUserDetail } from "@/features/(backoffice)/user-layout/context";

export default function Page() {
  const { user, setUser } = useUserDetail();
  return <ProfileTab user={user} onUserChange={(u) => setUser(u)} />;
}

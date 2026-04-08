"use client";

import ProfileTab from "@/features/(admin)/user-layout/tabs/profile-tab";
import { useUserDetail } from "@/features/(admin)/user-layout/context";

export default function Page() {
  const { user, setUser } = useUserDetail();
  return <ProfileTab user={user} onUserChange={(u) => setUser(u)} />;
}

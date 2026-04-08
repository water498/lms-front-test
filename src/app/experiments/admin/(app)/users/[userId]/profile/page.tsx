"use client";

import ProfileTab from "@/features/(admin)/user-detail/tabs/profile-tab";
import { useUserDetail } from "@/features/(admin)/user-detail/context";

export default function Page() {
  const { user, setUser } = useUserDetail();
  return <ProfileTab user={user} onUserChange={(u) => setUser(u)} />;
}

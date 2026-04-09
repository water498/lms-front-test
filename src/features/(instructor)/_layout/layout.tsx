"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import InstructorSidebar from "./sidebar";
import { useInstructorAuthStore } from "../shared/auth-store";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn } = useInstructorAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/instructor/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return <div className="bg-zinc-900 min-h-screen" />;

  return (
    <div className="bg-zinc-900 min-h-screen text-white">
      <InstructorSidebar />
      <main className="ml-56 min-h-screen">
        {children}
      </main>
    </div>
  );
}

"use client";

import { redirect } from "next/navigation";
import InstructorSidebar from "./sidebar";

// Mock: 현재 사용자 역할
const CURRENT_USER_ROLES = ["STUDENT", "INSTRUCTOR"];

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  if (!CURRENT_USER_ROLES.includes("INSTRUCTOR")) {
    redirect("/experiments/student");
  }

  return (
    <div className="bg-zinc-900 min-h-screen text-white">
      <InstructorSidebar />
      <main className="ml-56 min-h-screen">
        {children}
      </main>
    </div>
  );
}

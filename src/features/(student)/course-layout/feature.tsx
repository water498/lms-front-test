"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../student-dashboard/components/navbar";
import { Footer } from "../student-dashboard/components/footer";
import { CourseHero } from "./sections/course-hero";
import { DetailSidebar } from "./sections/detail-sidebar";
import { CourseProvider, useCourseContext } from "./context";
import StudentImpersonationBanner from "@/features/(admin)/shared/student-impersonation-banner";
import { InstructorProfileModal } from "@/components/instructor-profile-modal";

type Tab = "intro" | "curriculum" | "instructor" | "reviews";
const TABS: { id: Tab; label: string }[] = [
  { id: "intro", label: "소개" },
  { id: "curriculum", label: "커리큘럼" },
  { id: "instructor", label: "강사" },
  { id: "reviews", label: "리뷰" },
];

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    courseId,
    course,
    detail,
    cart,
    wishlist,
    isEnrolled,
    enrolledSessionId,
    addToCart,
    toggleWishlist,
    instructorModalOpen,
    setInstructorModalOpen,
  } = useCourseContext();

  const baseUrl = `/experiments/student/courses/${courseId}`;

  const activeTab = TABS.find((t) => pathname.endsWith(`/${t.id}`))?.id ?? "intro";

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <StudentImpersonationBanner />
      <Navbar cartCount={cart.size} />

      {/* Back button */}
      <div className="max-w-screen-xl mx-auto px-6 pt-4">
        <Link
          href="/experiments/student"
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          뒤로
        </Link>
      </div>

      {/* Hero */}
      <CourseHero course={course} variant="b2c" onInstructorClick={() => setInstructorModalOpen(true)} />

      {/* Body */}
      <div className="max-w-screen-xl mx-auto px-6 py-8 flex gap-8 items-start">
        {/* Left: tabs */}
        <div className="flex-1 min-w-0">
          {/* Tab bar */}
          <div className="flex gap-1 border-b border-zinc-800 mb-6">
            {TABS.map((tab) => (
              <Link
                key={tab.id}
                href={`${baseUrl}/${tab.id}`}
                className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-violet-500 text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {/* Tab content */}
          {children}
        </div>

        {/* Right: sidebar */}
        <DetailSidebar
          course={course}
          subjects={detail.subjects}
          cart={cart}
          wishlist={wishlist}
          isEnrolled={isEnrolled}
          enrolledSessionId={enrolledSessionId}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
        />
      </div>

      <Footer />

      {/* Instructor profile modal */}
      <InstructorProfileModal
        instructor={detail.instructor}
        open={instructorModalOpen}
        onClose={() => setInstructorModalOpen(false)}
      />
    </div>
  );
}

export default function CourseDetailShell({ children }: { children: React.ReactNode }) {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;

  return (
    <CourseProvider courseId={courseId}>
      <ShellInner>{children}</ShellInner>
    </CourseProvider>
  );
}

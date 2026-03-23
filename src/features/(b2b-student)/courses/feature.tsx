"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../home/components/navbar";
import { Footer } from "../home/components/footer";
import { CourseHero } from "@/features/(b2c-student)/courses/sections/course-hero";
import { IntroTab } from "@/features/(b2c-student)/courses/sections/intro-tab";
import { CurriculumTab } from "@/features/(b2c-student)/courses/sections/curriculum-tab";
import { InstructorTab } from "@/features/(b2c-student)/courses/sections/instructor-tab";
import { ReviewsTab } from "@/features/(b2c-student)/courses/sections/reviews-tab";
import { QnaTab } from "@/features/(b2c-student)/courses/sections/qna-tab";
import { DetailSidebar } from "@/features/(b2c-student)/courses/sections/detail-sidebar";
import { allCourses, inProgressCourses } from "../home/mockData";
import { courseDetails, defaultCourseDetail } from "@/features/(b2c-student)/courses/mockData";
import StudentImpersonationBanner from "@/features/(admin)/shared/student-impersonation-banner";

type Tab = "intro" | "curriculum" | "instructor" | "reviews" | "qna";
const TABS: { id: Tab; label: string }[] = [
  { id: "intro", label: "소개" },
  { id: "curriculum", label: "커리큘럼" },
  { id: "instructor", label: "강사" },
  { id: "reviews", label: "리뷰" },
  { id: "qna", label: "Q&A" },
];

interface Props {
  courseId: string;
}

export default function B2bCourseDetailFeature({ courseId }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("intro");

  const allCoursesList = [...allCourses, ...inProgressCourses];
  const course = allCoursesList.find((c) => c.id === courseId);
  const detail = courseDetails[courseId] ?? defaultCourseDetail;

  if (!course) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">강의를 찾을 수 없습니다.</p>
          <button
            onClick={() => router.push("/experiments/b2b-student")}
            className="text-violet-400 hover:text-violet-300 text-sm"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const averageRating =
    detail.reviews.length > 0
      ? detail.reviews.reduce((sum, r) => sum + r.rating, 0) / detail.reviews.length
      : course.rating ?? 0;

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <StudentImpersonationBanner />
      <Navbar />

      {/* Back button */}
      <div className="max-w-screen-xl mx-auto px-6 pt-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          뒤로
        </button>
      </div>

      {/* Hero */}
      <CourseHero course={course} variant="b2b" />

      {/* Body */}
      <div className="max-w-screen-xl mx-auto px-6 py-8 flex gap-8 items-start">
        {/* Left: tabs */}
        <div className="flex-1 min-w-0">
          {/* Tab bar */}
          <div className="flex gap-1 border-b border-zinc-800 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-violet-500 text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "intro" && <IntroTab detail={detail} />}
          {activeTab === "curriculum" && <CurriculumTab subjects={detail.subjects} />}
          {activeTab === "instructor" && <InstructorTab instructor={detail.instructor} />}
          {activeTab === "reviews" && (
            <ReviewsTab reviews={detail.reviews} averageRating={averageRating} />
          )}
          {activeTab === "qna" && <QnaTab courseId={courseId} />}
        </div>

        {/* Right: sidebar */}
        <DetailSidebar
          course={course}
          subjects={detail.subjects}
          cart={new Set()}
          wishlist={new Set()}
          onAddToCart={() => {}}
          onToggleWishlist={() => {}}
        />
      </div>

      <Footer />
    </div>
  );
}

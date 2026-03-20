"use client";

import { ClipboardList, Play, Star, TrendingUp } from "lucide-react";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { HeroBanner } from "./sections/hero-banner";
import { ScrollSection } from "./sections/scroll-section";
import { CategorySection } from "./sections/category-section";
import { StatsWidget } from "./sections/stats-widget";
import { AnnouncementGrid } from "./sections/announcement-grid";
import { ContextPanel } from "./sections/context-panel";
import {
  inProgressCourses,
  recommendedCourses,
  popularCourses,
  requiredCourses,
} from "./mockData";
import StudentImpersonationBanner from "@/features/(admin)/shared/student-impersonation-banner";

export default function B2bStudentFeature() {
  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <StudentImpersonationBanner />
      <Navbar />
      <ContextPanel />

      {/* 필수 수강 과정 섹션 */}
      {requiredCourses.length > 0 && (
        <div className="bg-rose-950/20 border-b border-rose-900/30">
          <div className="max-w-screen-xl mx-auto px-6 py-8">
            <ScrollSection
              title="필수 수강 과정"
              icon={<ClipboardList className="w-5 h-5" />}
              courses={requiredCourses}
            />
          </div>
        </div>
      )}

      <HeroBanner />

      <div className="max-w-screen-xl mx-auto px-6 py-12 flex flex-col gap-14">
        {/* 이어서 학습하기 */}
        {inProgressCourses.length > 0 && (
          <ScrollSection
            title="이어서 학습하기"
            icon={<Play className="w-5 h-5 fill-current" />}
            courses={inProgressCourses}
            showProgress
          />
        )}

        {/* 추천 강의 */}
        <ScrollSection
          title="추천 강의"
          icon={<Star className="w-5 h-5 fill-current" />}
          courses={recommendedCourses}
        />

        {/* 지금 인기있는 강의 */}
        <ScrollSection
          title="지금 인기있는 강의"
          icon={<TrendingUp className="w-5 h-5" />}
          courses={popularCourses}
        />

        {/* 카테고리별 추천 */}
        <CategorySection />

        {/* 내 학습 현황 */}
        <StatsWidget />

        {/* 공지/이벤트 */}
        <AnnouncementGrid />
      </div>

      <Footer />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, PenLine, Award } from "lucide-react";
import { inProgressCourses, type EnrolledCourse } from "../../home/mockData";
import { courseDetails, defaultCourseDetail } from "../../courses/mockData";

function firstActivityId(courseId: string): string {
  const detail = courseDetails[courseId] ?? defaultCourseDetail;
  return detail.subjects[0]?.activities[0]?.id ?? "";
}

const completedCourseMock: EnrolledCourse[] = [
  {
    id: "c-1",
    title: "HTML/CSS 기초 완성",
    instructor: "최유진",
    category: "frontend",
    categoryLabel: "프론트엔드",
    thumbnail: "linear-gradient(135deg, #1a1a2e, #16213e)",
    accentColor: "#818cf8",
    rating: 4.7,
    reviewCount: 1200,
    duration: "10시간",
    level: "입문",
    tags: ["HTML", "CSS"],
    price: 0,
    isNew: false,
    isBestseller: false,
    type: "online",
    progress: 100,
    lastAccessedAt: "2026-01-15",
    nextLessonTitle: "",
  },
  {
    id: "c-2",
    title: "JavaScript 핵심 개념",
    instructor: "강현우",
    category: "frontend",
    categoryLabel: "프론트엔드",
    thumbnail: "linear-gradient(135deg, #1a1a00, #3d3d00)",
    accentColor: "#fbbf24",
    rating: 4.8,
    reviewCount: 980,
    duration: "15시간",
    level: "초급",
    tags: ["JavaScript", "ES6+"],
    price: 29000,
    isNew: false,
    isBestseller: true,
    type: "online",
    progress: 100,
    lastAccessedAt: "2026-02-20",
    nextLessonTitle: "",
  },
  {
    id: "c-3",
    title: "Git & GitHub 실무",
    instructor: "임도현",
    category: "etc",
    categoryLabel: "기타",
    thumbnail: "linear-gradient(135deg, #1a0a00, #3d1800)",
    accentColor: "#f97316",
    rating: 4.9,
    reviewCount: 2400,
    duration: "8시간",
    level: "입문",
    tags: ["Git", "GitHub"],
    price: 0,
    isNew: false,
    isBestseller: true,
    type: "online",
    progress: 100,
    lastAccessedAt: "2025-12-10",
    nextLessonTitle: "",
  },
];

export { completedCourseMock };

export function LearningTab() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-8">
      {/* In Progress */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">수강 중</h3>
        <div className="flex flex-col gap-3">
          {inProgressCourses.map((course) => (
            <Link
              key={course.id}
              href={course.sessionId
                ? `/experiments/student/sessions/${course.sessionId}`
                : `/experiments/student/learn/${course.id}/${firstActivityId(course.id)}`
              }
              className="flex gap-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 items-center cursor-pointer transition-colors"
            >
              <div
                className="w-20 h-14 rounded-xl shrink-0"
                style={{ background: course.thumbnail }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-tight line-clamp-1 mb-0.5">{course.title}</p>
                <p className="text-xs text-zinc-500 mb-2">{course.instructor} · {course.level}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-400 shrink-0">{course.progress}%</span>
                </div>
                <p className="text-xs text-zinc-600 mt-1">다음: {course.nextLessonTitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Completed */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">완료</h3>
        <div className="flex flex-col gap-3">
          {completedCourseMock.map((course) => (
            <div key={course.id} className="flex gap-4 bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-4 items-center">
              <div
                className="w-20 h-14 rounded-xl shrink-0 relative"
                style={{ background: course.thumbnail }}
              >
                <div className="absolute inset-0 rounded-xl bg-black/30 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-300 line-clamp-1 mb-0.5">{course.title}</p>
                <p className="text-xs text-zinc-500">{course.instructor}</p>
                <p className="text-xs text-emerald-500 mt-1">✓ 완료 · {course.lastAccessedAt}</p>
              </div>
              <div className="shrink-0 flex flex-col gap-1.5">
                <button
                  onClick={() => router.push(`/experiments/student/courses/${course.id}`)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 px-3 py-2 border border-zinc-700 rounded-lg transition-colors"
                >
                  다시 보기
                </button>
                <Link
                  href={`/experiments/student/courses/${course.id}?tab=reviews`}
                  className="flex items-center justify-center gap-1 text-xs text-zinc-500 hover:text-violet-400 px-3 py-2 border border-zinc-700 rounded-lg transition-colors"
                >
                  <PenLine className="w-3 h-3" />
                  리뷰 작성
                </Link>
                <Link
                  href="/experiments/student/my/certificates"
                  className="flex items-center justify-center gap-1 text-xs text-zinc-500 hover:text-amber-400 px-3 py-2 border border-zinc-700 rounded-lg transition-colors"
                >
                  <Award className="w-3 h-3" />
                  수료증
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

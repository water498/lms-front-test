"use client";

import Link from "next/link";
import { ShoppingCart, CreditCard, BookOpen, Award, BarChart2, Clock, Play } from "lucide-react";
import { type Course } from "../../home/mockData";
import { type CourseSubject } from "@/lib/models";
import { courseDetails, defaultCourseDetail } from "../mockData";
import { useTenantContextStore } from "../../shared/tenant-context-store";

interface Props {
  course: Course;
  subjects: CourseSubject[];
  cart: Set<string>;
  wishlist: Set<string>;
  isEnrolled?: boolean;
  onAddToCart: (id: string) => void;
  onToggleWishlist: (id: string) => void;
}

export function DetailSidebar({ course, subjects, cart, isEnrolled, onAddToCart }: Props) {
  const { features } = useTenantContextStore((s) => s.tenant);
  const firstActivityId = (() => {
    const detail = courseDetails[course.id] ?? defaultCourseDetail;
    return detail.subjects[0]?.activities[0]?.id ?? "";
  })();
  const totalActivities = subjects.reduce((sum, s) => sum + s.activities.length, 0);
  const totalMinutes = subjects.reduce(
    (sum, s) => sum + s.activities.reduce((acc, a) => acc + (a.duration ?? 0), 0),
    0
  );
  const isInCart = cart.has(course.id);

  return (
    <div className="w-72 shrink-0">
      <div className="sticky top-6 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {/* Thumbnail / preview area */}
        <div
          className="w-full h-40"
          style={{ background: course.thumbnail }}
        />

        <div className="p-5 flex flex-col gap-4">
          {/* 결제/장바구니 — [B2C only] */}
          {features.payments ? (
            <div className="flex flex-col gap-2">
              {isEnrolled ? (
                <>
                  <span className="text-center text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    수강 중
                  </span>
                  <Link
                    href={`/experiments/b2c-student/learn/${course.id}/${firstActivityId}`}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    이어 보기
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-white">
                    {(course.price ?? 0) === 0 ? "무료" : `₩${(course.price ?? 0).toLocaleString()}`}
                  </p>
                  {(course.price ?? 0) > 0 && (
                    <>
                      {features.cart && (
                        <button
                          onClick={() => { if (!isInCart) onAddToCart(course.id); }}
                          className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                            isInCart
                              ? "bg-zinc-700 text-zinc-400 cursor-default"
                              : "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                          }`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {isInCart ? "장바구니에 담김" : "장바구니 담기"}
                        </button>
                      )}
                      <Link
                        href="/experiments/b2c-student/checkout"
                        onClick={() => { if (!isInCart) onAddToCart(course.id); }}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        바로 결제하기
                      </Link>
                    </>
                  )}
                  {(course.price ?? 0) === 0 && (
                    <Link
                      href={`/experiments/b2c-student/learn/${course.id}/${firstActivityId}`}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      무료 수강하기
                    </Link>
                  )}
                </>
              )}
            </div>
          ) : (
            /* B2B: 수강 신청은 관리자 경유 */
            <div className="flex flex-col gap-2">
              {course.isRequired && (
                <span className="text-center text-xs font-semibold px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  필수 수강 과정
                </span>
              )}
              <p className="text-xs text-zinc-500 text-center">
                수강 신청은 관리자에게 문의하세요
              </p>
              <button className="w-full py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4" />
                수강하기
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-zinc-800" />

          {/* Course stats */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <BookOpen className="w-4 h-4 text-zinc-600 shrink-0" />
              <span>총 {totalActivities}강</span>
            </div>
            {totalMinutes > 0 && (
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Clock className="w-4 h-4 text-zinc-600 shrink-0" />
                <span>
                  {totalMinutes >= 60
                    ? `${Math.floor(totalMinutes / 60)}시간 ${totalMinutes % 60 > 0 ? `${totalMinutes % 60}분` : ""}`
                    : `${totalMinutes}분`}
                </span>
              </div>
            )}
            {course.level && (
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <BarChart2 className="w-4 h-4 text-zinc-600 shrink-0" />
                <span>{course.level}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Award className="w-4 h-4 text-zinc-600 shrink-0" />
              <span>수료증 발급</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

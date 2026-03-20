"use client";

import { ShoppingCart, CreditCard, BookOpen, Award, BarChart2, Clock } from "lucide-react";
import { type Course } from "../../home/mockData";
import { type CourseSubject } from "@/lib/models";

interface Props {
  course: Course;
  variant: "b2c" | "b2b";
  subjects: CourseSubject[];
  cart: Set<string>;
  wishlist: Set<string>;
  onAddToCart: (id: string) => void;
  onToggleWishlist: (id: string) => void;
}

export function DetailSidebar({ course, variant, subjects, cart, onAddToCart }: Props) {
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
          {/* B2C: price + buttons */}
          {variant === "b2c" && (
            <div className="flex flex-col gap-2">
              <p className="text-2xl font-bold text-white">
                {(course.price ?? 0) === 0 ? "무료" : `₩${(course.price ?? 0).toLocaleString()}`}
              </p>
              {(course.price ?? 0) > 0 && (
                <>
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
                  <button className="w-full py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors flex items-center justify-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    바로 결제하기
                  </button>
                </>
              )}
              {(course.price ?? 0) === 0 && (
                <button className="w-full py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors">
                  무료 수강신청
                </button>
              )}
            </div>
          )}

          {/* B2B: enroll button */}
          {variant === "b2b" && (
            <div className="flex flex-col gap-2">
              {course.isRequired && (
                <span className="text-center text-xs font-semibold px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  필수 수강 과정
                </span>
              )}
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

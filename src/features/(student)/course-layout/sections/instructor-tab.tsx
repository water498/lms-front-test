"use client";

import { useState } from "react";
import { Star, PenLine, X, User } from "lucide-react";
import { type InstructorProfile, type InstructorReview } from "@/lib/models";
import { courseDetails, defaultCourseDetail } from "../mockData";

interface Props {
  instructor: InstructorProfile;
  isCompleted?: boolean;
  courseId?: string;
  onProfileClick?: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function InteractiveStar({
  value, hovered, filled, onHover, onClick,
}: {
  value: number; hovered: number; filled: number;
  onHover: (v: number) => void; onClick: (v: number) => void;
}) {
  const active = hovered >= value || (!hovered && filled >= value);
  return (
    <button type="button" onMouseEnter={() => onHover(value)} onMouseLeave={() => onHover(0)} onClick={() => onClick(value)} className="p-0.5">
      <Star className={`w-7 h-7 transition-colors ${active ? "fill-amber-400 text-amber-400" : "text-zinc-700"}`} />
    </button>
  );
}

const STAR_LABELS = ["", "별로예요", "그저 그래요", "괜찮아요", "좋아요", "최고예요!"];

// ── Component ────────────────────────────────────────────────────────────────

export function InstructorTab({ instructor, isCompleted, courseId, onProfileClick }: Props) {
  const detail = courseId ? (courseDetails[courseId] ?? defaultCourseDetail) : defaultCourseDetail;
  const [reviews, setReviews] = useState<InstructorReview[]>(detail.instructorReviews);
  const [showModal, setShowModal] = useState(false);
  const [hovered, setHovered] = useState(0);
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");

  const displayName = instructor.headline?.split("·")[0].trim() ?? "강사";
  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = () => {
    if (rating === 0 || !body.trim()) return;
    const newReview: InstructorReview = {
      id: `ir-new-${Date.now()}`,
      instructorId: instructor.userId,
      courseId: courseId,
      learnerId: "me",
      learnerName: "홍길동",
      rating,
      body: body.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
      visible: true,
    };
    setReviews((prev) => [newReview, ...prev]);
    setShowModal(false);
    setRating(0);
    setBody("");
    setHovered(0);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ── Profile section ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-base font-semibold text-white mb-5">강사 소개</h2>
        <div className="flex flex-col gap-5">
          {/* Profile header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-zinc-400">
                {displayName.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-base font-semibold text-white">{displayName}</p>
              <p className="text-sm text-zinc-400">{instructor.headline}</p>
              {instructor.affiliatedCompany && (
                <p className="text-xs text-zinc-500 mt-0.5">{instructor.affiliatedCompany}</p>
              )}
            </div>
          </div>

          {/* Expertise tags */}
          {(instructor.expertise?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-2">
              {instructor.expertise?.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Bio */}
          <p className="text-sm text-zinc-400 leading-relaxed">{instructor.bio}</p>

          {/* Profile detail button */}
          {onProfileClick && (
            <button
              onClick={onProfileClick}
              className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors w-fit"
            >
              <User className="w-3.5 h-3.5" />
              프로필 상세보기
            </button>
          )}
        </div>
      </div>

      {/* ── Instructor reviews section ──────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-white">강사 리뷰</h2>
            {reviews.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-amber-400">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-zinc-500">({reviews.length}개)</span>
              </div>
            )}
          </div>
          {isCompleted ? (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm rounded-lg transition-colors"
            >
              <PenLine className="w-3.5 h-3.5" />
              강사 리뷰 작성
            </button>
          ) : (
            <p className="text-xs text-zinc-500">과정 완료 후 리뷰를 작성할 수 있습니다</p>
          )}
        </div>

        {reviews.length > 0 ? (
          <div className="flex flex-col gap-3">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0">
                    {review.learnerName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{review.learnerName}</p>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"}`} />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-xs text-zinc-600">{review.createdAt}</span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{review.body}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">아직 강사 리뷰가 없습니다.</p>
        )}
      </div>

      {/* ── Write modal ─────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl p-6 flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">강사 리뷰 작성</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-zinc-400">
              <span className="text-white font-medium">{displayName}</span> 강사님은 어떠셨나요?
            </p>

            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((v) => (
                  <InteractiveStar key={v} value={v} hovered={hovered} filled={rating} onHover={setHovered} onClick={setRating} />
                ))}
              </div>
              <p className={`text-sm font-medium transition-colors ${rating ? "text-amber-400" : "text-zinc-600"}`}>
                {STAR_LABELS[hovered || rating] || "별점을 선택해주세요"}
              </p>
            </div>

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="강사님에 대한 솔직한 리뷰를 남겨주세요."
              rows={4}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 resize-none"
            />

            <button
              onClick={handleSubmit}
              disabled={rating === 0 || !body.trim()}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-semibold text-sm rounded-xl transition-colors"
            >
              리뷰 등록
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

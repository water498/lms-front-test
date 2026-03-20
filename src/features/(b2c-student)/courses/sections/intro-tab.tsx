"use client";

import { Check } from "lucide-react";
import { type CourseDetail } from "../mockData";

interface Props {
  detail: CourseDetail;
}

export function IntroTab({ detail }: Props) {
  return (
    <div className="flex flex-col gap-8">
      {/* What you'll learn */}
      <div>
        <h2 className="text-base font-semibold text-white mb-4">이런 걸 배워요</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {detail.whatYouLearn.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-sm text-zinc-300">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div>
        <h2 className="text-base font-semibold text-white mb-4">수강 전 필요 지식</h2>
        <ul className="flex flex-col gap-2">
          {detail.requirements.map((req, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-2" />
              <span className="text-sm text-zinc-400">{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-base font-semibold text-white mb-4">강의 소개</h2>
        <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">{detail.description}</p>
      </div>
    </div>
  );
}

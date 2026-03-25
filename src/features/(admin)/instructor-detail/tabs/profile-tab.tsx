"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { InstructorProfile } from "@/lib/models";

interface Props {
  profile: InstructorProfile;
  instructorName: string;
}

export default function InstructorProfileTab({ profile, instructorName }: Props) {
  const [isPublic, setIsPublic] = useState(profile.isPublic ?? true);

  return (
    <div className="grid grid-cols-2 gap-5">
      {/* 헤더 카드 */}
      <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-2xl flex-shrink-0">
          {instructorName[0]}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-slate-800">{instructorName}</h2>
          {profile.headline && (
            <p className="text-sm text-slate-500 mt-0.5">{profile.headline}</p>
          )}
          {profile.specialty && (
            <p className="text-xs text-slate-400 mt-0.5">{profile.specialty}</p>
          )}
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <span className="text-sm text-slate-500">{isPublic ? "공개" : "비공개"}</span>
          <button
            onClick={() => setIsPublic((v) => !v)}
            className={`relative w-10 h-5.5 rounded-full transition-colors ${
              isPublic ? "bg-violet-600" : "bg-slate-300"
            }`}
            style={{ height: "22px", width: "40px" }}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                isPublic ? "translate-x-[18px]" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* 프로필 정보 */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-slate-700">기본 정보</h3>
        <dl className="flex flex-col gap-3">
          {[
            { label: "한 줄 소개",  value: profile.headline },
            { label: "전문 분야",   value: profile.specialty },
            { label: "소속",        value: profile.affiliatedCompany },
            { label: "웹사이트",    value: profile.websiteUrl },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm gap-4">
              <dt className="text-slate-400 shrink-0">{label}</dt>
              <dd className="text-slate-700 font-medium text-right">{value ?? "—"}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-slate-700">소개 · 경력</h3>
        <div className="flex flex-col gap-4 text-sm">
          {profile.bio && (
            <div>
              <p className="text-xs text-slate-400 mb-1">강사 소개</p>
              <p className="text-slate-700 leading-relaxed">{profile.bio}</p>
            </div>
          )}
          {profile.career && (
            <div>
              <p className="text-xs text-slate-400 mb-1">경력</p>
              <p className="text-slate-700 whitespace-pre-line leading-relaxed">{profile.career}</p>
            </div>
          )}
          {!profile.bio && !profile.career && (
            <p className="text-slate-400">소개 정보 없음</p>
          )}
        </div>
      </div>
    </div>
  );
}

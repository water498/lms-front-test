"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const MOCK_PROFILE = {
  headline: "풀스택 개발자 · 5년 경력",
  specialty: "React, Node.js, TypeScript",
  bio: "실무 중심의 강의를 통해 수강생들이 현업에서 바로 사용할 수 있는 기술을 가르칩니다.",
  career: "2019–현재 스타트업 CTO\n2016–2019 네이버 소프트웨어 엔지니어",
  websiteUrl: "https://example.com",
  isPublic: true,
};

export function InstructorTab() {
  const [headline, setHeadline] = useState(MOCK_PROFILE.headline);
  const [specialty, setSpecialty] = useState(MOCK_PROFILE.specialty);
  const [bio, setBio] = useState(MOCK_PROFILE.bio);
  const [career, setCareer] = useState(MOCK_PROFILE.career);
  const [websiteUrl, setWebsiteUrl] = useState(MOCK_PROFILE.websiteUrl);
  const [isPublic, setIsPublic] = useState(MOCK_PROFILE.isPublic);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      {/* Public toggle */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isPublic ? (
            <Eye className="w-4 h-4 text-violet-400" />
          ) : (
            <EyeOff className="w-4 h-4 text-zinc-500" />
          )}
          <div>
            <p className="text-sm font-medium text-white">프로필 공개</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              {isPublic ? "수강생에게 강사 소개 페이지가 노출됩니다." : "강사 소개 페이지가 숨겨집니다."}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsPublic((v) => !v)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            isPublic ? "bg-violet-600" : "bg-zinc-700"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              isPublic ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Edit form */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400">한 줄 소개</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="직함 · 경력 요약"
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400">전문 분야</label>
          <input
            type="text"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="React, Node.js, ..."
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400">강사 소개</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="수강생에게 보여질 강사 소개를 작성하세요."
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400">경력 사항</label>
          <textarea
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            rows={3}
            placeholder="주요 경력을 입력하세요."
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400">웹사이트</label>
          <input
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://..."
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <button
          onClick={handleSave}
          className={`py-3 rounded-xl font-semibold text-sm transition-colors ${
            saved
              ? "bg-emerald-600 text-white"
              : "bg-violet-600 hover:bg-violet-500 text-white"
          }`}
        >
          {saved ? "✓ 저장되었습니다" : "저장하기"}
        </button>
      </div>
    </div>
  );
}

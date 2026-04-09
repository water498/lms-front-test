"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import {
  CURRENT_INSTRUCTOR_ID,
  instructorProfiles,
} from "../shared/mockData";
import type { InstructorProfile } from "@/lib/models";

export default function InstructorProfileFeature() {
  const initial = instructorProfiles[CURRENT_INSTRUCTOR_ID];
  const [form, setForm] = useState<InstructorProfile>(
    initial ?? {
      userId: CURRENT_INSTRUCTOR_ID,
      headline: "",
      specialty: "",
      bio: "",
      career: "",
      affiliatedCompany: "",
      websiteUrl: "",
      isPublic: true,
      updatedAt: new Date().toISOString(),
    }
  );
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof InstructorProfile, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    // mock 저장
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">프로필</h1>
        <p className="text-sm text-slate-500 mt-1">수강생에게 표시되는 강사 프로필을 편집합니다.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-5">
        {/* 헤드라인 */}
        <Field label="헤드라인">
          <input
            type="text"
            value={form.headline ?? ""}
            onChange={(e) => handleChange("headline", e.target.value)}
            placeholder="예: 풀스택 개발자 · 7년 경력"
            className="input"
          />
        </Field>

        {/* 전문 분야 */}
        <Field label="전문 분야">
          <input
            type="text"
            value={form.specialty ?? ""}
            onChange={(e) => handleChange("specialty", e.target.value)}
            placeholder="예: React, Node.js, TypeScript"
            className="input"
          />
        </Field>

        {/* 소개 */}
        <Field label="강사 소개">
          <textarea
            rows={4}
            value={form.bio ?? ""}
            onChange={(e) => handleChange("bio", e.target.value)}
            placeholder="강의 철학, 경험, 수강생에게 전하고 싶은 말 등을 작성해주세요."
            className="input resize-none"
          />
        </Field>

        {/* 경력 */}
        <Field label="경력 사항" hint="줄바꿈으로 구분">
          <textarea
            rows={4}
            value={form.career ?? ""}
            onChange={(e) => handleChange("career", e.target.value)}
            placeholder={"2022–현재 회사명 직책\n2019–2022 회사명 직책"}
            className="input resize-none font-mono text-xs"
          />
        </Field>

        {/* 소속 */}
        <Field label="소속 기관">
          <input
            type="text"
            value={form.affiliatedCompany ?? ""}
            onChange={(e) => handleChange("affiliatedCompany", e.target.value)}
            placeholder="예: 오픈이노베이션"
            className="input"
          />
        </Field>

        {/* 웹사이트 */}
        <Field label="웹사이트">
          <input
            type="url"
            value={form.websiteUrl ?? ""}
            onChange={(e) => handleChange("websiteUrl", e.target.value)}
            placeholder="https://example.com"
            className="input"
          />
        </Field>

        {/* 프로필 공개 */}
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-slate-900">프로필 공개</p>
            <p className="text-xs text-slate-400 mt-0.5">비공개 시 강사 목록에 표시되지 않습니다.</p>
          </div>
          <button
            onClick={() => handleChange("isPublic", !form.isPublic)}
            className={`relative w-10 h-5.5 rounded-full transition-colors ${
              form.isPublic ? "bg-violet-600" : "bg-slate-200"
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                form.isPublic ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            saved
              ? "bg-emerald-600 text-slate-900"
              : "bg-violet-600 hover:bg-violet-700 text-slate-900"
          }`}
        >
          {saved && <Check size={14} />}
          {saved ? "저장됨" : "저장"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-xs font-medium text-slate-500">{label}</label>
        {hint && <span className="text-[10px] text-slate-500">{hint}</span>}
      </div>
      <style>{`.input { background: rgb(39 39 42); border: 1px solid rgb(63 63 70); color: white; font-size: 0.875rem; border-radius: 0.5rem; padding: 0.5rem 0.75rem; width: 100%; outline: none; } .input:focus { border-color: rgb(124 58 237); } .input::placeholder { color: rgb(113 113 122); }`}</style>
      {children}
    </div>
  );
}

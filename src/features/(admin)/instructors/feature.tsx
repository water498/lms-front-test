"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { instructors } from "./mockData";

export default function InstructorsFeature() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">강사 관리</h1>
        <p className="text-sm text-slate-500 mt-0.5">등록된 강사 목록과 프로필 현황을 관리합니다.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 font-semibold text-slate-500">강사</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-500">전문 분야</th>
              <th className="text-center px-5 py-3 font-semibold text-slate-500">담당 차수</th>
              <th className="text-center px-5 py-3 font-semibold text-slate-500">강사 평점</th>
              <th className="text-center px-5 py-3 font-semibold text-slate-500">프로필 공개</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {instructors.map((inst) => (
              <tr key={inst.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold text-sm flex-shrink-0">
                      {inst.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{inst.name}</p>
                      <p className="text-xs text-slate-400">{inst.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-600">{inst.specialty ?? "—"}</td>
                <td className="px-5 py-3.5 text-center text-slate-700">{inst.courseCount}개</td>
                <td className="px-5 py-3.5 text-center">
                  {inst.reviewCount > 0 ? (
                    <div className="flex items-center justify-center gap-1">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      <span className="font-medium text-slate-700">{inst.avgRating.toFixed(1)}</span>
                      <span className="text-xs text-slate-400">({inst.reviewCount})</span>
                    </div>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    inst.isPublic
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {inst.isPublic ? "공개" : "비공개"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    href={`/experiments/admin/instructors/${inst.id}`}
                    className="text-xs font-medium text-violet-600 hover:text-violet-700 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-colors"
                  >
                    상세 보기
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

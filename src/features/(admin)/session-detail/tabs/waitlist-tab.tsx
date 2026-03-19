"use client";

import { useState } from "react";
import type { WaitList } from "@/lib/models";
import { getWaitList } from "../mockData";

interface Props {
  sessionId: string;
}

export default function WaitlistTab({ sessionId }: Props) {
  const [items, setItems] = useState<WaitList[]>(() => getWaitList(sessionId));

  const pendingCount = items.filter((w) => w.status === "WAITING").length;

  function approve(id: string) {
    setItems((prev) => prev.map((w) => w.id === id ? { ...w, status: "APPROVED" } : w));
  }

  function cancel(id: string) {
    setItems((prev) => prev.map((w) => w.id === id ? { ...w, status: "CANCELLED" } : w));
  }

  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-slate-700">대기자</h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
          {pendingCount}명 대기 중
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-400 py-8 text-center">현재 대기자가 없습니다.</p>
      ) : (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium w-12">#</th>
                <th className="px-4 py-2.5 text-left font-medium">이름</th>
                <th className="px-4 py-2.5 text-left font-medium">신청일</th>
                <th className="px-4 py-2.5 text-left font-medium">상태</th>
                <th className="px-4 py-2.5 text-left font-medium">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((w, i) => (
                <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{w.userName}</td>
                  <td className="px-4 py-3 text-slate-500">{w.requestedAt}</td>
                  <td className="px-4 py-3">
                    {w.status === "WAITING" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">대기 중</span>
                    )}
                    {w.status === "APPROVED" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">등록됨</span>
                    )}
                    {w.status === "CANCELLED" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">취소됨</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {w.status === "WAITING" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => approve(w.id)}
                          className="text-xs px-2.5 py-1 rounded-md bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                        >
                          수락
                        </button>
                        <button
                          onClick={() => cancel(w.id)}
                          className="text-xs px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          취소
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

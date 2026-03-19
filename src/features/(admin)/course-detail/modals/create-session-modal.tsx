"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { instructors } from "../../courses/mockData";
import type { SessionType } from "../mockData";

interface Props {
  isOffline?: boolean;
  defaultMinEnrollment?: number | null;
  onClose: () => void;
}

export default function CreateSessionModal({ isOffline = false, defaultMinEnrollment, onClose }: Props) {
  const [sessionType, setSessionType] = useState<SessionType>("COHORT");
  const [name, setName] = useState("");
  const [cohortNumber, setCohortNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [capacity, setCapacity] = useState("30");
  const [minEnrollment, setMinEnrollment] = useState<string>(
    defaultMinEnrollment != null ? String(defaultMinEnrollment) : ""
  );
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([instructors[0]]);
  const [location, setLocation] = useState("");
  const [visible, setVisible] = useState(true);
  const [forSale, setForSale] = useState(true);

  function toggleInstructor(name: string) {
    setSelectedInstructors((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-800">차수 추가</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* 운영 유형 */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-2 block">운영 유형</label>
            <div className="flex gap-3">
              {([
                { value: "COHORT",     label: "정규",     desc: "시작일/종료일, 기수 번호" },
                { value: "SELF_PACED", label: "상시",     desc: "기간 없음, 언제든 수강" },
              ] as { value: SessionType; label: string; desc: string }[]).map((t) => (
                <label
                  key={t.value}
                  className={`flex-1 flex flex-col gap-0.5 border rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                    sessionType === t.value
                      ? "border-violet-500 bg-violet-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="sessionType"
                    value={t.value}
                    checked={sessionType === t.value}
                    onChange={() => setSessionType(t.value)}
                    className="sr-only"
                  />
                  <span className={`text-sm font-medium ${sessionType === t.value ? "text-violet-700" : "text-slate-700"}`}>
                    {t.label}
                  </span>
                  <span className="text-xs text-slate-400">{t.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 차수명 */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">차수명</label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder={sessionType === "COHORT" ? "예: 1기 (2025 상반기)" : "예: 자유수강"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* 정규: 기수 번호 + 날짜 */}
          {sessionType === "COHORT" && (
            <>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">기수 번호</label>
                <input
                  type="number"
                  min="1"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  placeholder="예: 1"
                  value={cohortNumber}
                  onChange={(e) => setCohortNumber(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">시작일</label>
                  <input
                    type="date"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">종료일</label>
                  <input
                    type="date"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {/* 정원 */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              정원 <span className="text-slate-400 font-normal">(0 = 무제한)</span>
            </label>
            <input
              type="number"
              min="0"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>

          {/* 최소 수강 인원 — COHORT only */}
          {sessionType === "COHORT" && (
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">최소 수강 인원</label>
              <input
                type="number"
                min="0"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="빈 값 = 체크 안 함"
                value={minEnrollment}
                onChange={(e) => setMinEnrollment(e.target.value)}
              />
              {defaultMinEnrollment != null && (
                <p className="text-xs text-slate-400 mt-1">
                  과정 기본값 {defaultMinEnrollment}명에서 불러옴
                </p>
              )}
            </div>
          )}

          {/* 강사 배정 */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-2 block">강사 배정</label>
            <div className="flex flex-wrap gap-2">
              {instructors.map((i) => (
                <label
                  key={i}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs cursor-pointer border transition-colors ${
                    selectedInstructors.includes(i)
                      ? "bg-violet-100 border-violet-300 text-violet-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedInstructors.includes(i)}
                    onChange={() => toggleInstructor(i)}
                    className="sr-only"
                  />
                  {i}
                </label>
              ))}
            </div>
          </div>

          {/* 오프라인 장소 */}
          {isOffline && (
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">장소</label>
              <input
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="예: 강남교육센터 3F"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          )}

          {/* 노출 / 판매 여부 */}
          <div className="flex flex-col gap-2.5 pt-1">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm text-slate-700">노출 여부</span>
                <p className="text-xs text-slate-400">수강신청 페이지에 이 차수를 표시합니다</p>
              </div>
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className={`relative w-10 h-5 rounded-full transition-colors ${visible ? "bg-violet-500" : "bg-slate-200"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${visible ? "translate-x-5" : ""}`} />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm text-slate-700">판매 여부</span>
                <p className="text-xs text-slate-400">B2C에서 개별 결제를 허용합니다</p>
              </div>
              <button
                type="button"
                onClick={() => setForSale((v) => !v)}
                className={`relative w-10 h-5 rounded-full transition-colors ${forSale ? "bg-violet-500" : "bg-slate-200"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${forSale ? "translate-x-5" : ""}`} />
              </button>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}

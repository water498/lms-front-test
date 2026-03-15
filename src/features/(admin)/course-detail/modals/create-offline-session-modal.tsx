"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { instructors } from "../../courses/mockData";

interface Props {
  onClose: () => void;
}

export default function CreateOfflineSessionModal({ onClose }: Props) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("18:00");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("30");
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([instructors[0]]);

  function toggleInstructor(name: string) {
    setSelectedInstructors((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-800">회차 추가</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* 일자 */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">일자</label>
            <input
              type="date"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* 시간 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">시작 시각</label>
              <input
                type="time"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">종료 시각</label>
              <input
                type="time"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* 장소 */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">장소</label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="예: 강남교육센터 3F"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* 강사 */}
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

          {/* 정원 */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">정원</label>
            <input
              type="number"
              min="1"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
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

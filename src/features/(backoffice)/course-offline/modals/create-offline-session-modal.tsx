"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { instructors } from "../../course-list/mockData";
import type { CourseInstructor } from "@/lib/models";

interface Props {
  onClose: () => void;
}

export default function CreateOfflineSessionModal({ onClose }: Props) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("18:00");
  const [location, setLocation] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [locationLat, setLocationLat] = useState("");
  const [locationLng, setLocationLng] = useState("");
  const [capacity, setCapacity] = useState("30");
  const [selectedInstructors, setSelectedInstructors] = useState<CourseInstructor[]>(
    [{ name: instructors[0], role: "PRIMARY" }]
  );

  function addInstructor(name: string) {
    const role: "PRIMARY" | "ASSISTANT" =
      selectedInstructors.some((i) => i.role === "PRIMARY") ? "ASSISTANT" : "PRIMARY";
    setSelectedInstructors((prev) => [...prev, { name, role }]);
  }

  function removeInstructor(name: string) {
    setSelectedInstructors((prev) => prev.filter((i) => i.name !== name));
  }

  function toggleRole(name: string) {
    setSelectedInstructors((prev) =>
      prev.map((i) =>
        i.name === name
          ? { ...i, role: i.role === "PRIMARY" ? "ASSISTANT" : "PRIMARY" }
          : i
      )
    );
  }

  const unassigned = instructors.filter(
    (name) => !selectedInstructors.some((i) => i.name === name)
  );

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

          {/* 장소명 */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">장소명</label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="예: 강남교육센터 3F"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* 도로명 주소 */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">도로명 주소</label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="예: 서울시 강남구 테헤란로 152"
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
            />
          </div>

          {/* 위도/경도 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">위도 (선택)</label>
              <input
                type="number"
                step="any"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="37.5065"
                value={locationLat}
                onChange={(e) => setLocationLat(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">경도 (선택)</label>
              <input
                type="number"
                step="any"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="127.0536"
                value={locationLng}
                onChange={(e) => setLocationLng(e.target.value)}
              />
            </div>
          </div>

          {/* 강사 */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-2 block">강사 배정</label>

            {/* 배정된 강사 목록 */}
            {selectedInstructors.length > 0 && (
              <div className="flex flex-col gap-1.5 mb-2">
                {selectedInstructors.map((inst) => (
                  <div key={inst.name} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm text-slate-800 flex-1">{inst.name}</span>
                    <button
                      type="button"
                      onClick={() => toggleRole(inst.name)}
                      className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                        inst.role === "PRIMARY"
                          ? "bg-violet-100 border-violet-300 text-violet-700"
                          : "bg-slate-100 border-slate-300 text-slate-600 hover:border-violet-300 hover:text-violet-600"
                      }`}
                    >
                      {inst.role === "PRIMARY" ? "주강사" : "보조강사"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeInstructor(inst.name)}
                      className="text-slate-400 hover:text-red-400 transition-colors text-sm leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 추가 가능한 강사 */}
            {unassigned.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {unassigned.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => addInstructor(name)}
                    className="text-xs px-2.5 py-1 border border-dashed border-slate-300 text-slate-500 rounded-lg hover:border-violet-400 hover:text-violet-600 transition-colors"
                  >
                    + {name}
                  </button>
                ))}
              </div>
            )}
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

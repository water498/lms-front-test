"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ExternalLink, Search } from "lucide-react";
import { type CourseActivity, type ActivityType } from "../mockData";
import { mediaAssets } from "../../media/mockData";
import { examTemplates, assignmentTemplates } from "../../assessments/mockData";

type ActivityTab = "MEDIA" | "QUIZ" | "ASSIGNMENT";

const TABS: { id: ActivityTab; icon: string; label: string }[] = [
  { id: "MEDIA", icon: "📹", label: "미디어 자료" },
  { id: "QUIZ", icon: "📝", label: "시험" },
  { id: "ASSIGNMENT", icon: "📋", label: "과제" },
];

const SUBTYPE_LABELS: Record<string, string> = {
  SHORT: "단답 시험",
  FINAL: "최종 시험",
};

const SUBMISSION_LABELS: Record<string, string> = {
  FILE: "파일 업로드",
  TEXT: "텍스트 입력",
  BOTH: "파일 + 텍스트",
};

interface Props {
  subjectTitle: string;
  onAdd: (activity: CourseActivity) => void;
  onClose: () => void;
}

export default function AddActivityModal({
  subjectTitle,
  onAdd,
  onClose,
}: Props) {
  const [activeTab, setActiveTab] = useState<ActivityTab>("MEDIA");
  const [title, setTitle] = useState("");
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<
    "ALL" | "VIDEO" | "SCORM"
  >("ALL");
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedAssignId, setSelectedAssignId] = useState<string | null>(null);

  const filteredMedia = mediaAssets.filter((a) => {
    if (a.status !== "ACTIVE") return false;
    if (mediaTypeFilter === "VIDEO" && a.assetType !== "VIDEO") return false;
    if (mediaTypeFilter === "SCORM" && a.assetType !== "SCORM") return false;
    if (
      mediaTypeFilter === "ALL" &&
      a.assetType !== "VIDEO" &&
      a.assetType !== "SCORM"
    )
      return false;
    if (
      mediaSearch &&
      !a.displayName.toLowerCase().includes(mediaSearch.toLowerCase())
    )
      return false;
    return true;
  });

  const canAdd =
    title.trim() !== "" &&
    ((activeTab === "MEDIA" && selectedMediaId !== null) ||
      (activeTab === "QUIZ" && selectedExamId !== null) ||
      (activeTab === "ASSIGNMENT" && selectedAssignId !== null));

  function buildActivity(): CourseActivity {
    const id = `a${Date.now()}`;
    if (activeTab === "MEDIA" && selectedMediaId) {
      const asset = mediaAssets.find((a) => a.id === selectedMediaId)!;
      const type: ActivityType =
        asset.assetType === "SCORM" ? "SCORM" : "VIDEO";
      return { id, title, type, mediaAssetId: selectedMediaId };
    }
    if (activeTab === "QUIZ") {
      const template = examTemplates.find((e) => e.id === selectedExamId);
      return {
        id,
        title,
        type: "QUIZ",
        examTemplateId: selectedExamId ?? undefined,
        questionCount: template?.rules.reduce((s, r) => s + r.count, 0),
      };
    }
    // ASSIGNMENT
    return {
      id,
      title,
      type: "ASSIGNMENT",
      assignTemplateId: selectedAssignId ?? undefined,
    };
  }

  function handleAdd() {
    if (!canAdd) return;
    onAdd(buildActivity());
  }

  function selectMedia(id: string, displayName: string) {
    setSelectedMediaId(id);
    if (!title) setTitle(displayName);
  }

  function selectExam(id: string, examTitle: string) {
    setSelectedExamId(id);
    if (!title) setTitle(examTitle);
  }

  function selectAssign(id: string, assignTitle: string) {
    setSelectedAssignId(id);
    if (!title) setTitle(assignTitle);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-slate-800">활동 추가</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-4">{subjectTitle}</p>

        {/* Title input */}
        <div className="mb-4">
          <label className="text-xs font-medium text-slate-600 mb-1 block">
            제목
          </label>
          <input
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            placeholder="활동 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 border-b border-slate-200 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? "border-violet-600 text-violet-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* MEDIA tab */}
        {activeTab === "MEDIA" && (
          <div className="mb-5">
            {/* Search + filter */}
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  className="w-full border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-violet-400"
                  placeholder="검색..."
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-1">
                {(["ALL", "VIDEO", "SCORM"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setMediaTypeFilter(f)}
                    className={`px-2 py-1.5 text-xs rounded-lg border transition-colors ${
                      mediaTypeFilter === f
                        ? "border-violet-400 bg-violet-50 text-violet-700"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {f === "ALL" ? "전체" : f}
                  </button>
                ))}
              </div>
            </div>

            {/* Asset list */}
            {filteredMedia.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">
                해당 유형의 활성 자료가 없습니다.
              </p>
            ) : (
              <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
                {filteredMedia.map((asset) => (
                  <label
                    key={asset.id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                      selectedMediaId === asset.id
                        ? "border-violet-400 bg-violet-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="mediaAsset"
                      value={asset.id}
                      checked={selectedMediaId === asset.id}
                      onChange={() => selectMedia(asset.id, asset.displayName)}
                      className="sr-only"
                    />
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 border-2 ${selectedMediaId === asset.id ? "border-violet-600 bg-violet-600" : "border-slate-300"}`}
                    />
                    <span className="text-base flex-shrink-0">
                      {asset.assetType === "SCORM" ? "📦" : "📹"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm truncate ${selectedMediaId === asset.id ? "text-violet-700 font-medium" : "text-slate-700"}`}
                      >
                        {asset.displayName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {asset.size} · {asset.assetType}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <Link
              href="/experiments/admin/media"
              target="_blank"
              className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 hover:text-violet-600 transition-colors"
            >
              <ExternalLink size={13} />
              콘텐츠 라이브러리 관리
            </Link>
          </div>
        )}

        {/* QUIZ tab */}
        {activeTab === "QUIZ" && (
          <div className="mb-5">
            {examTemplates.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">
                등록된 시험 템플릿이 없습니다.
              </p>
            ) : (
              <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
                {examTemplates.map((e) => (
                  <label
                    key={e.id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                      selectedExamId === e.id
                        ? "border-violet-400 bg-violet-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="examTemplate"
                      value={e.id}
                      checked={selectedExamId === e.id}
                      onChange={() => selectExam(e.id, e.title)}
                      className="sr-only"
                    />
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 border-2 ${selectedExamId === e.id ? "border-violet-600 bg-violet-600" : "border-slate-300"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm truncate ${selectedExamId === e.id ? "text-violet-700 font-medium" : "text-slate-700"}`}
                      >
                        {e.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {SUBTYPE_LABELS[e.subType]} ·{" "}
                        {e.rules.reduce((s, r) => s + r.count, 0)}문항 · 통과{" "}
                        {e.passingScore}%
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
            <Link
              href="/experiments/admin/assessments/exam/new"
              target="_blank"
              className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 hover:text-violet-600 transition-colors"
            >
              <ExternalLink size={13} />새 시험 만들기
            </Link>
          </div>
        )}

        {/* ASSIGNMENT tab */}
        {activeTab === "ASSIGNMENT" && (
          <div className="mb-5">
            {assignmentTemplates.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">
                등록된 과제 템플릿이 없습니다.
              </p>
            ) : (
              <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
                {assignmentTemplates.map((a) => (
                  <label
                    key={a.id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                      selectedAssignId === a.id
                        ? "border-violet-400 bg-violet-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="assignTemplate"
                      value={a.id}
                      checked={selectedAssignId === a.id}
                      onChange={() => selectAssign(a.id, a.title)}
                      className="sr-only"
                    />
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 border-2 ${selectedAssignId === a.id ? "border-violet-600 bg-violet-600" : "border-slate-300"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm truncate ${selectedAssignId === a.id ? "text-violet-700 font-medium" : "text-slate-700"}`}
                      >
                        {a.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {SUBMISSION_LABELS[a.submissionType]} · 루브릭{" "}
                        {a.rubric.length}항목
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
            <Link
              href="/experiments/admin/assessments/assignment/new"
              target="_blank"
              className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 hover:text-violet-600 transition-colors"
            >
              <ExternalLink size={13} />새 과제 만들기
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className="px-4 py-2 text-sm text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}

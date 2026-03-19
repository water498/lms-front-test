"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PORTAL_BANNERS, PORTAL_POPUPS } from "../../settings/mockData";
import type { PortalBanner } from "../../settings/mockData";

type Tab = "banners" | "popups";

export default function PortalBannersFeature() {
  const [activeTab, setActiveTab] = useState<Tab>("banners");
  const [banners, setBanners] = useState<PortalBanner[]>(PORTAL_BANNERS);
  const [popups, setPopups] = useState<PortalBanner[]>(PORTAL_POPUPS);

  const items = activeTab === "banners" ? banners : popups;
  const setItems = activeTab === "banners" ? setBanners : setPopups;

  const toggleActive = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item)),
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("삭제하시겠습니까?")) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-800 mb-0.5">배너 · 팝업</h2>
          <p className="text-xs text-slate-400">포털 메인에 노출할 배너와 팝업을 관리합니다.</p>
        </div>
        <button
          onClick={() => alert("배너 추가 (실험 환경)")}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
        >
          <Plus size={13} />
          추가
        </button>
      </div>

      {/* 탭 */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        {(["banners", "popups"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === t
                ? "bg-white shadow-sm text-slate-800"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t === "banners" ? "배너" : "팝업"}
          </button>
        ))}
      </div>

      {/* 목록 */}
      {items.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl">
          등록된 {activeTab === "banners" ? "배너" : "팝업"}가 없습니다.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 px-4 py-3 bg-white border border-slate-200 rounded-xl"
            >
              {/* 이미지 placeholder */}
              <div className="w-16 h-10 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center text-xs text-slate-400">
                이미지
              </div>

              {/* 정보 */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{item.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {item.startDate} ~ {item.endDate}
                </p>
              </div>

              {/* 활성화 토글 */}
              <button
                onClick={() => toggleActive(item.id)}
                style={{
                  width: "36px",
                  height: "20px",
                  background: item.active ? "#7c3aed" : "#e2e8f0",
                }}
                className="relative rounded-full transition-colors flex-shrink-0"
              >
                <span
                  className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${
                    item.active ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
              <span className={`text-xs w-8 flex-shrink-0 ${item.active ? "text-violet-600" : "text-slate-400"}`}>
                {item.active ? "노출" : "숨김"}
              </span>

              {/* 액션 */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => alert(`편집: ${item.title}`)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

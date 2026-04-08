"use client";

import { useState, useMemo } from "react";
import { X, CheckCircle2, XCircle } from "lucide-react";
import {
  TENANTS,
  PLATFORM_DOMAIN,
  validateSubdomain,
  type SubdomainStatus,
} from "../mockData";

interface Props {
  onClose: () => void;
}

const STATUS_MESSAGE: Record<SubdomainStatus, string> = {
  empty:    "",
  format:   "소문자·영숫자·하이픈만 허용 (최소 2자)",
  reserved: "예약어로 사용 불가",
  taken:    "이미 사용 중인 서브도메인",
  valid:    "사용 가능",
};

export default function CreateTenantModal({ onClose }: Props) {
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [maxUsers, setMaxUsers] = useState(0);
  const [storageGB, setStorageGB] = useState(100);
  const [contractEnd, setContractEnd] = useState("");

  const existingSubdomains = useMemo(() => TENANTS.map((t) => t.subdomain), []);
  const subdomainStatus = useMemo(
    () => validateSubdomain(subdomain, existingSubdomains),
    [subdomain, existingSubdomains],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subdomainStatus !== "valid") return;
    alert(
      `기업 생성 요청:\n${name} (${subdomain}.${PLATFORM_DOMAIN})\n담당자: ${adminEmail}\n최대 학습자: ${maxUsers === 0 ? "무제한" : maxUsers + "명"}\n스토리지: ${storageGB}GB\n계약 종료: ${contractEnd}`,
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">
            신규 기업 온보딩
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">기업명</label>
            <input
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="예) 삼성전자"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">
              서브도메인
            </label>
            <div
              className={`flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 ${
                subdomainStatus === "valid"
                  ? "border-green-400"
                  : subdomainStatus !== "empty"
                    ? "border-red-400"
                    : "border-slate-200"
              }`}
            >
              <input
                className="flex-1 px-3 py-2 text-sm focus:outline-none"
                placeholder="samsung"
                value={subdomain}
                onChange={(e) =>
                  setSubdomain(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                  )
                }
                required
              />
              {subdomain && (
                <span className="px-2">
                  {subdomainStatus === "valid" ? (
                    <CheckCircle2 size={15} className="text-green-500" />
                  ) : (
                    <XCircle size={15} className="text-red-500" />
                  )}
                </span>
              )}
              <span className="bg-slate-50 border-l border-slate-200 px-3 py-2 text-xs text-slate-400">
                .{PLATFORM_DOMAIN}
              </span>
            </div>
            {subdomain && subdomainStatus !== "empty" && (
              <p
                className={`text-xs mt-0.5 ${
                  subdomainStatus === "valid" ? "text-green-600" : "text-red-500"
                }`}
              >
                {STATUS_MESSAGE[subdomainStatus]}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">
              기업 Admin 이메일
            </label>
            <input
              type="email"
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="admin@company.com"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
            />
            <p className="text-xs text-slate-400 mt-0.5">
              생성 완료 시 위 이메일로 초대 링크가 자동 발송됩니다.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">
                최대 학습자 수
                <span className="text-slate-400 font-normal ml-1">(0 = 무제한)</span>
              </label>
              <input
                type="number"
                min={0}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={maxUsers}
                onChange={(e) => setMaxUsers(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">
                스토리지 한도 (GB)
              </label>
              <input
                type="number"
                min={1}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={storageGB}
                onChange={(e) => setStorageGB(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">
              계약 종료일
            </label>
            <input
              type="date"
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={contractEnd}
              onChange={(e) => setContractEnd(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={subdomainStatus !== "valid"}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              온보딩 시작
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

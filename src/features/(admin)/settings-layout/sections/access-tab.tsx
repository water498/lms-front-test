"use client";

import { useState } from "react";
import { Copy, CheckCircle2, FlaskConical } from "lucide-react";

const SP_ENTITY_ID = "https://lms.openknock.io/sso/company-abc";
const ACS_URL = "https://lms.openknock.io/sso/company-abc/acs";

function CopyableField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-slate-400">{label}</span>
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
        <span className="font-mono text-xs text-slate-700 flex-1 break-all">{value}</span>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
        >
          {copied ? (
            <CheckCircle2 size={13} className="text-green-500" />
          ) : (
            <Copy size={13} />
          )}
        </button>
      </div>
    </div>
  );
}

export default function AccessTab() {
  const [idpSsoUrl, setIdpSsoUrl] = useState("");
  const [idpCertificate, setIdpCertificate] = useState("");

  const isConfigured = idpSsoUrl.trim() !== "" && idpCertificate.trim() !== "";

  const handleTest = () => {
    if (!isConfigured) {
      alert("IdP SSO URL과 X.509 인증서를 먼저 입력하세요.");
      return;
    }
    alert("연결 테스트: SSO 엔드포인트에 ping 요청을 보냅니다. (실험 환경)");
  };

  const handleSave = () => {
    alert("SSO 설정이 저장되었습니다. (실험 환경)");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* SP 정보 (읽기 전용) */}
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-slate-700">SP 정보</h3>
        <p className="text-xs text-slate-400">
          아래 값을 IdP(Azure AD, Okta 등)에 등록하세요.
        </p>
        <CopyableField label="SP Entity ID / Audience URI" value={SP_ENTITY_ID} />
        <CopyableField label="ACS URL (Assertion Consumer Service)" value={ACS_URL} />
      </section>

      <div className="border-t border-slate-100" />

      {/* IdP 설정 */}
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-slate-700">IdP 설정</h3>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">IdP SSO URL</label>
          <input
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-400"
            placeholder="https://login.microsoftonline.com/.../saml2"
            value={idpSsoUrl}
            onChange={(e) => setIdpSsoUrl(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">X.509 인증서</label>
          <textarea
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
            rows={4}
            placeholder="MIIDAzCCAeugAwIBAgI..."
            value={idpCertificate}
            onChange={(e) => setIdpCertificate(e.target.value)}
          />
        </div>

      </section>

      <div className="border-t border-slate-100" />

      {/* 연결 상태 */}
      <section className="flex items-center gap-3">
        <span className="text-xs font-medium text-slate-600">연결 상태</span>
        {isConfigured ? (
          <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            연결됨
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            미설정
          </span>
        )}
      </section>

      {/* 액션 버튼 */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={handleTest}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
        >
          <FlaskConical size={13} />
          테스트 연결
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors font-medium"
        >
          저장
        </button>
      </div>
    </div>
  );
}

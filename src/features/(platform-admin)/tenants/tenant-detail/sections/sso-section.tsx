"use client";

import { useState } from "react";
import { Shield, Eye, EyeOff, FlaskConical } from "lucide-react";
import type { Tenant, SsoProvider } from "@/lib/models";
import { PLATFORM_DOMAIN } from "../../mockData";

interface Props {
  tenant: Tenant;
}

export default function SsoSection({ tenant }: Props) {
  const init = tenant.sso ?? { enabled: false, provider: "SAML" as SsoProvider };
  const [enabled, setEnabled] = useState(init.enabled);
  const [provider, setProvider] = useState<SsoProvider>(init.provider ?? "SAML");

  // SAML
  const [idpEntityId, setIdpEntityId] = useState(init.idpEntityId ?? "");
  const [idpSsoUrl, setIdpSsoUrl] = useState(init.idpSsoUrl ?? "");
  const [idpCertificate, setIdpCertificate] = useState(init.idpCertificate ?? "");

  // OIDC
  const [issuerUrl, setIssuerUrl] = useState(init.issuerUrl ?? "");
  const [clientId, setClientId] = useState(init.clientId ?? "");
  const [clientSecret, setClientSecret] = useState(init.clientSecret ?? "");
  const [showSecret, setShowSecret] = useState(false);

  const redirectUri = `https://${tenant.subdomain}.${PLATFORM_DOMAIN}/auth/callback`;
  const entityId = `https://${tenant.subdomain}.${PLATFORM_DOMAIN}/auth/saml/metadata`;

  const handleSave = () => {
    alert(`SSO 설정 저장 (실험 환경)\n기업: ${tenant.name}\n활성화: ${enabled}\n프로바이더: ${provider}`);
  };

  const handleTest = () => {
    alert("연결 테스트: SSO 엔드포인트에 ping 요청을 보냅니다. (실험 환경)");
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield size={15} className="text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-700">SSO 설정</h3>
        </div>
        <button
          onClick={() => setEnabled((v) => !v)}
          style={{ width: "40px", height: "22px", background: enabled ? "#2563eb" : "#e2e8f0" }}
          className="relative rounded-full transition-colors"
        >
          <span
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              enabled ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      <div className={`flex flex-col gap-4 ${!enabled ? "opacity-40 pointer-events-none" : ""}`}>
        {/* Provider selector */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          {(["SAML", "OIDC"] as SsoProvider[]).map((p) => (
            <button
              key={p}
              onClick={() => setProvider(p)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                provider === p
                  ? "bg-white shadow-sm text-slate-800"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {provider === "SAML" ? (
          <div className="flex flex-col gap-3">
            <SsoField
              label="IdP Entity ID"
              placeholder="https://sts.windows.net/..."
              value={idpEntityId}
              onChange={setIdpEntityId}
            />
            <SsoField
              label="IdP SSO URL"
              placeholder="https://login.microsoftonline.com/.../saml2"
              value={idpSsoUrl}
              onChange={setIdpSsoUrl}
            />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">
                X.509 인증서
              </label>
              <textarea
                className="border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                rows={3}
                placeholder="MIIDAzCCAeugAwIBAgI..."
                value={idpCertificate}
                onChange={(e) => setIdpCertificate(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <SsoField
              label="Issuer URL"
              placeholder="https://login.microsoftonline.com/.../v2.0"
              value={issuerUrl}
              onChange={setIssuerUrl}
            />
            <SsoField
              label="Client ID"
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              value={clientId}
              onChange={setClientId}
            />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">
                Client Secret
              </label>
              <div className="relative flex items-center">
                <input
                  type={showSecret ? "text" : "password"}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 pr-9"
                  placeholder="••••••••••••••••"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowSecret((v) => !v)}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SP 정보 */}
        <div className="bg-slate-50 rounded-lg p-3 flex flex-col gap-2 border border-slate-100">
          <p className="text-xs font-medium text-slate-500">
            SP 정보 — IdP에 등록할 값
          </p>
          <ReadOnlyRow
            label={provider === "SAML" ? "Entity ID / Audience URI" : "Redirect URI"}
            value={provider === "SAML" ? entityId : redirectUri}
          />
          {provider === "SAML" && (
            <ReadOnlyRow label="ACS URL" value={redirectUri} />
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handleTest}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            <FlaskConical size={13} />
            연결 테스트
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

function SsoField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-600">{label}</label>
      <input
        className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="font-mono text-xs text-slate-700 break-all">{value}</span>
    </div>
  );
}

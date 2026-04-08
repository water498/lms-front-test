"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "../student-dashboard/components/navbar";
import store from "../student-dashboard/store";

const TABS = [
  { id: "terms",   label: "이용약관" },
  { id: "privacy", label: "개인정보처리방침" },
  { id: "policy",  label: "운영정책" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const CONTENT: Record<TabId, { effectiveDate: string; body: string }> = {
  terms: {
    effectiveDate: "2026-01-01",
    body: `제1조 (목적)
이 약관은 OpenKnock(이하 "회사")이 제공하는 온라인 학습 플랫폼 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조 (정의)
① "서비스"란 회사가 운영하는 온라인 교육 플랫폼으로, 강의 수강, 자료 다운로드, 수료증 발급 등의 기능을 포함합니다.
② "이용자"란 회사의 서비스에 접속하여 이 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.
③ "회원"이란 회사에 개인정보를 제공하여 회원 등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 서비스를 이용할 수 있는 자를 말합니다.

제3조 (약관의 효력 및 변경)
① 이 약관은 서비스 화면에 게시하거나 기타 방법으로 이용자에게 공지함으로써 효력이 발생합니다.
② 회사는 약관의 규제에 관한 법률, 정보통신망 이용 촉진 및 정보보호 등에 관한 법률 등 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
③ 회사가 약관을 개정할 경우 개정 내용과 적용 일자를 명시하여 현행 약관과 함께 서비스 화면에 그 적용일자 7일 전부터 공지합니다.

제4조 (서비스의 제공 및 중단)
① 회사는 연중무휴, 1일 24시간 서비스를 제공함을 원칙으로 합니다.
② 회사는 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의 사유가 발생한 경우 서비스의 제공을 일시적으로 중단할 수 있습니다.`,
  },
  privacy: {
    effectiveDate: "2026-01-01",
    body: `개인정보처리방침

OpenKnock(이하 "회사")은 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.

제1조 (개인정보의 처리 목적)
회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.

① 회원 가입 및 관리
회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지 목적으로 개인정보를 처리합니다.

② 재화 또는 서비스 제공
강의 제공, 수료증 발급, 결제·정산 등을 목적으로 개인정보를 처리합니다.

제2조 (개인정보의 처리 및 보유 기간)
① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
- 회원 가입 및 관리: 회원 탈퇴 시까지 (단, 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지)
- 결제 및 재화 서비스 제공: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)`,
  },
  policy: {
    effectiveDate: "2026-01-01",
    body: `운영정책

제1조 (목적)
이 운영정책은 OpenKnock 서비스를 건전하게 이용하고 이용자 간 원활한 학습 환경을 조성하기 위하여 이용자가 지켜야 할 사항을 규정합니다.

제2조 (금지 행위)
이용자는 다음 각 호에 해당하는 행위를 하여서는 안 됩니다.
① 타인의 개인정보를 수집, 저장, 공개하는 행위
② 서비스를 통해 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포하는 행위
③ 회사의 저작권, 제3자의 저작권 등 지적재산권에 반하는 행위
④ 강의 콘텐츠를 무단으로 녹화, 캡처, 배포하는 행위
⑤ 타인의 계정을 도용하거나 허위 정보로 회원가입하는 행위

제3조 (콘텐츠 정책)
① 강사는 저작권 침해, 허위·과장 광고, 성인 콘텐츠가 포함된 강의를 등록할 수 없습니다.
② 학습 Q&A 게시판에는 강의 내용과 무관한 광고성 게시물을 올릴 수 없습니다.
③ 수강 후기는 실제 수강한 강의에 대한 솔직한 평가여야 하며, 허위 리뷰 또는 경쟁 업체 비방 등의 내용은 운영자에 의해 삭제될 수 있습니다.

제4조 (제재 조치)
회사는 이용자가 이 운영정책을 위반하는 경우 경고, 일시 이용 정지, 영구 이용 정지 등의 제재 조치를 취할 수 있습니다.`,
  },
};

export default function TermsFeature() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabId | null) ?? "terms";
  const [activeTab, setActiveTab] = useState<TabId>(
    TABS.find((t) => t.id === initialTab) ? initialTab : "terms",
  );

  // Sync tab with URL param on navigation
  useEffect(() => {
    const tab = searchParams.get("tab") as TabId | null;
    if (tab && TABS.find((t) => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const current = CONTENT[activeTab];

  return (
    <div className="bg-zinc-950 min-h-screen text-white">
      <Navbar cartCount={store.cart.size} />

      <main className="max-w-screen-md mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-white mb-8">약관 및 정책</h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-zinc-800 pb-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "text-white border-violet-500"
                  : "text-zinc-500 border-transparent hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <p className="text-xs text-zinc-500 mb-6">시행일: {current.effectiveDate}</p>
          <pre className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">
            {current.body}
          </pre>
        </div>
      </main>
    </div>
  );
}

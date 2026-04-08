"use client";

import { useState } from "react";
import { INITIAL_SETTINGS } from "../mockData";
import InfoTooltip from "@/components/info-tooltip";

export default function GeneralTab() {
  const init = INITIAL_SETTINGS.general;
  const [serviceName, setServiceName] = useState(init.serviceName);
  const [opsEmail, setOpsEmail] = useState(init.opsEmail);
  const [supportEmail, setSupportEmail] = useState(init.supportEmail);

  const handleSave = () => {
    alert(
      `일반 설정 저장\n서비스명: ${serviceName}\n운영 이메일: ${opsEmail}\n지원 이메일: ${supportEmail}`,
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            서비스명
            <InfoTooltip text="학습자·관리자 화면 상단, 이메일 발신자명, 수료증 등 모든 브랜딩 영역에 표시되는 플랫폼 이름입니다." />
          </label>
          <input
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            루트 도메인
            <InfoTooltip
              text="모든 기업 서브도메인의 기반이 되는 도메인입니다. 변경 시 전체 기업 URL이 바뀌므로 운영팀 승인 후에만 수정 가능합니다."
              position="top"
            />
          </label>
          <input
            readOnly
            className="border border-slate-100 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
            value={init.rootDomain}
          />
          <p className="text-xs text-slate-400">플랫폼 루트 도메인은 변경 불가</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            운영 이메일
            <InfoTooltip text="시스템 장애 알림, 기업 생성 승인 요청, 스토리지 임계 초과 등 내부 운영 알림이 발송되는 이메일입니다. 외부에 노출되지 않습니다." />
          </label>
          <input
            type="email"
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={opsEmail}
            onChange={(e) => setOpsEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            지원 이메일
            <InfoTooltip text="학습자·기업 관리자 화면에 노출되는 문의 이메일입니다. '문의하기' 버튼 및 이메일 푸터에 표시되며 고객 지원팀 수신함으로 연결합니다." />
          </label>
          <input
            type="email"
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
        >
          저장
        </button>
      </div>
    </div>
  );
}

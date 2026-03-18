/**
 * InfoTooltip
 *
 * 라벨 옆에 ⓘ 아이콘을 붙이고, 마우스를 올리면 설명 툴팁을 표시합니다.
 *
 * 사용 예:
 *   <label className="flex items-center gap-1">
 *     운영 이메일
 *     <InfoTooltip text="시스템 장애 알림 등 내부 운영 알림이 발송되는 이메일입니다." />
 *   </label>
 *
 * Props:
 *   text      — 툴팁에 표시할 설명 텍스트
 *   position  — 툴팁 방향 (기본값: "top")
 *               "top" | "bottom" | "left" | "right"
 */

type Position = "top" | "bottom" | "left" | "right";

interface InfoTooltipProps {
  text: string;
  position?: Position;
}

const positionClasses: Record<
  Position,
  { tooltip: string; arrow: string }
> = {
  top: {
    tooltip: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    arrow:
      "top-full left-1/2 -translate-x-1/2 border-t-slate-800 border-x-transparent border-b-transparent",
  },
  bottom: {
    tooltip: "top-full left-1/2 -translate-x-1/2 mt-2",
    arrow:
      "bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 border-x-transparent border-t-transparent",
  },
  left: {
    tooltip: "right-full top-1/2 -translate-y-1/2 mr-2",
    arrow:
      "left-full top-1/2 -translate-y-1/2 border-l-slate-800 border-y-transparent border-r-transparent",
  },
  right: {
    tooltip: "left-full top-1/2 -translate-y-1/2 ml-2",
    arrow:
      "right-full top-1/2 -translate-y-1/2 border-r-slate-800 border-y-transparent border-l-transparent",
  },
};

export default function InfoTooltip({
  text,
  position = "top",
}: InfoTooltipProps) {
  const { tooltip, arrow } = positionClasses[position];

  return (
    <span className="relative group inline-flex items-center">
      {/* 아이콘 */}
      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 text-xs flex items-center justify-center cursor-help select-none hover:bg-slate-300 transition-colors font-medium leading-none">
        i
      </span>

      {/* 툴팁 */}
      <span
        className={`
          absolute ${tooltip}
          w-52 px-3 py-2 rounded-lg
          bg-slate-800 text-white text-xs leading-relaxed
          opacity-0 group-hover:opacity-100
          transition-opacity duration-150
          pointer-events-none z-50
          whitespace-normal
        `}
      >
        {text}
        {/* 화살표 */}
        <span
          className={`absolute border-4 ${arrow}`}
          style={{ borderStyle: "solid" }}
        />
      </span>
    </span>
  );
}

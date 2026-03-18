export type { UserGroup } from "@/lib/models";
import type { UserGroup } from "@/lib/models";

export const userGroups: UserGroup[] = [
  {
    id: "group-1",
    name: "신입 온보딩",
    description: "신규 입사자 필수 온보딩 과정 대상 그룹",
    memberIds: ["u5", "u6", "u7"],
    createdAt: "2025-01-15",
  },
  {
    id: "group-2",
    name: "리더십 교육",
    description: "팀장급 이상 리더십 역량 강화 교육 대상",
    memberIds: ["u2", "u3", "u8"],
    createdAt: "2025-02-01",
  },
  {
    id: "group-3",
    name: "안전교육 필수",
    description: "현장 근무자 법정 안전교육 이수 대상 그룹",
    memberIds: ["u4", "u7", "u9", "u10"],
    createdAt: "2025-02-20",
  },
];

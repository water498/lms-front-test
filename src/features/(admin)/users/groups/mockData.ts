export type { UserGroup, UserGroupMember } from "@/lib/models";
import type { UserGroup, UserGroupMember } from "@/lib/models";

export const userGroupMembers: UserGroupMember[] = [
  // group-1: 신입 온보딩 (u5, u6, u7)
  { id: "ugm1",  groupId: "group-1", userId: "u5",  role: "MEMBER",  joinedAt: "2025-01-15", addedBy: "u2" },
  { id: "ugm2",  groupId: "group-1", userId: "u6",  role: "MEMBER",  joinedAt: "2025-01-15", addedBy: "u2" },
  { id: "ugm3",  groupId: "group-1", userId: "u7",  role: "MEMBER",  joinedAt: "2025-02-05", addedBy: "u2" },
  // group-2: 리더십 교육 (u2, u3, u8)
  { id: "ugm4",  groupId: "group-2", userId: "u2",  role: "MANAGER", joinedAt: "2025-02-01", addedBy: "u2" },
  { id: "ugm5",  groupId: "group-2", userId: "u3",  role: "MEMBER",  joinedAt: "2025-02-01", addedBy: "u2" },
  { id: "ugm6",  groupId: "group-2", userId: "u8",  role: "MEMBER",  joinedAt: "2025-02-01", addedBy: "u2" },
  // group-3: 안전교육 필수 (u4, u7, u9, u10)
  { id: "ugm7",  groupId: "group-3", userId: "u4",  role: "MEMBER",  joinedAt: "2025-02-20", addedBy: "u2" },
  { id: "ugm8",  groupId: "group-3", userId: "u7",  role: "MEMBER",  joinedAt: "2025-02-20", addedBy: "u2" },
  { id: "ugm9",  groupId: "group-3", userId: "u9",  role: "MEMBER",  joinedAt: "2025-02-20", addedBy: "u2" },
  { id: "ugm10", groupId: "group-3", userId: "u10", role: "MEMBER",  joinedAt: "2025-02-20", addedBy: "u2" },
];

function memberIdsOf(groupId: string): string[] {
  return userGroupMembers.filter((m) => m.groupId === groupId).map((m) => m.userId);
}

export const userGroups: UserGroup[] = [
  { id: "group-1", name: "신입 온보딩",   description: "신규 입사자 필수 온보딩 과정 대상 그룹", memberIds: memberIdsOf("group-1"), createdAt: "2025-01-15" },
  { id: "group-2", name: "리더십 교육",   description: "팀장급 이상 리더십 역량 강화 교육 대상", memberIds: memberIdsOf("group-2"), createdAt: "2025-02-01" },
  { id: "group-3", name: "안전교육 필수", description: "현장 근무자 법정 안전교육 이수 대상 그룹", memberIds: memberIdsOf("group-3"), createdAt: "2025-02-20" },
];

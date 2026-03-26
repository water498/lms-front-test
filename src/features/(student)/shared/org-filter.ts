export interface LearnerOrg {
  orgTeamId?: string;
  orgPositionId?: string;
  orgSiteId?: string;
}

/**
 * 학습자의 조직 속성이 세션의 수강 대상 조건을 만족하는지 확인.
 * - 각 target 배열이 비어있으면 → 제한 없음 (전체 공개)
 * - learner 속성이 없으면 → pass (속성 미설정 학습자는 제한 없음)
 */
export function matchesOrgFilter(
  targetAudience:
    | { departments?: string[]; jobGrades?: string[]; sites?: string[] }
    | undefined,
  learner: LearnerOrg
): boolean {
  if (!targetAudience) return true;
  const { departments, jobGrades, sites } = targetAudience;
  if (departments?.length && learner.orgTeamId && !departments.includes(learner.orgTeamId)) return false;
  if (jobGrades?.length && learner.orgPositionId && !jobGrades.includes(learner.orgPositionId)) return false;
  if (sites?.length && learner.orgSiteId && !sites.includes(learner.orgSiteId)) return false;
  return true;
}

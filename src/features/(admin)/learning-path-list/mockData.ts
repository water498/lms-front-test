import type { LearningPath, LearningPathCourse } from "@/lib/models";
import { courses } from "../course-list/mockData";

export { courses };

export const learningPaths: LearningPath[] = [
  {
    id: "lp1",
    tenantId: "tenant-1",
    title: "현장 안전 기초 완성",
    description: "핵심안전수칙부터 안전보건관리체계까지, 현장 작업자 필수 안전 교육을 한 번에 이수합니다.",
    price: 290000,
    status: "PUBLISHED",
    createdAt: "2025-01-15",
  },
  {
    id: "lp2",
    tenantId: "tenant-1",
    title: "위험관리 전문가 과정",
    description: "위험성 평가부터 법규 이해까지, 안전관리 실무 전문가 양성을 위한 심화 학습 경로입니다.",
    price: 299000,
    status: "PUBLISHED",
    createdAt: "2025-02-10",
  },
  {
    id: "lp3",
    tenantId: "tenant-1",
    title: "안전문화 리더십 과정",
    description: "경영진 및 중간관리자를 위한 안전문화 구축과 안전마인드 향상 통합 과정입니다.",
    status: "DRAFT",
    createdAt: "2025-03-05",
  },
];

export const learningPathCourses: LearningPathCourse[] = [
  { learningPathId: "lp1", courseId: "c1", order: 1 },
  { learningPathId: "lp1", courseId: "c2", order: 2 },
  { learningPathId: "lp1", courseId: "c3", order: 3 },
  { learningPathId: "lp1", courseId: "c8", order: 4 },
  { learningPathId: "lp2", courseId: "c4", order: 1 },
  { learningPathId: "lp2", courseId: "c5", order: 2 },
  { learningPathId: "lp3", courseId: "c7", order: 1 },
  { learningPathId: "lp3", courseId: "c6", order: 2 },
];

export function getLearningPathCourses(learningPathId: string) {
  return learningPathCourses
    .filter((lpc) => lpc.learningPathId === learningPathId)
    .sort((a, b) => a.order - b.order)
    .map((lpc) => ({
      ...lpc,
      course: courses.find((c) => c.id === lpc.courseId)!,
    }));
}

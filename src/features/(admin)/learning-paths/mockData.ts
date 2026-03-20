import type { LearningPath, LearningPathCourse } from "@/lib/models";
import { courses } from "../courses/mockData";

export { courses };

export const learningPaths: LearningPath[] = [
  {
    id: "lp1",
    tenantId: "tenant-1",
    title: "프론트엔드 풀코스",
    description: "React부터 Next.js까지 프론트엔드 개발의 전 과정을 한 번에 학습합니다.",
    price: 290000,
    status: "PUBLISHED",
    createdAt: "2025-01-15",
  },
  {
    id: "lp2",
    tenantId: "tenant-1",
    title: "클라우드 & DevOps 입문",
    description: "AWS 클라우드와 컨테이너 기술을 단계적으로 배우는 실무 중심 학습 경로입니다.",
    price: 299000,
    status: "PUBLISHED",
    createdAt: "2025-02-10",
  },
  {
    id: "lp3",
    tenantId: "tenant-1",
    title: "데이터 분석 기초",
    description: "SQL과 Python을 활용한 데이터 분석 입문 과정입니다.",
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

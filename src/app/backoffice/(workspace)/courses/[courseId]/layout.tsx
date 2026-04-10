// v1: import CourseDetailShell from "@/features/(backoffice)/course-layout/feature";
import CourseDetailShellV2 from "@/features/(backoffice)/v2-course-layout/feature";

export default function CourseDetailLayout({ children }: { children: React.ReactNode }) {
  return <CourseDetailShellV2>{children}</CourseDetailShellV2>;
}

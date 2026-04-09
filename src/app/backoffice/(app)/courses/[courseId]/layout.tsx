import CourseDetailShell from "@/features/(backoffice)/course-layout/feature";

export default function CourseDetailLayout({ children }: { children: React.ReactNode }) {
  return <CourseDetailShell>{children}</CourseDetailShell>;
}

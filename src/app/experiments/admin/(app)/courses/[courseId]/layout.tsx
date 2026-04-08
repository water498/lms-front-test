import CourseDetailShell from "@/features/(admin)/course-detail/shell";

export default function CourseDetailLayout({ children }: { children: React.ReactNode }) {
  return <CourseDetailShell>{children}</CourseDetailShell>;
}

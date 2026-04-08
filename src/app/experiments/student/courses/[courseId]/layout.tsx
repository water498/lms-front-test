import CourseDetailShell from "@/features/(student)/courses/shell";

export default function CourseDetailLayout({ children }: { children: React.ReactNode }) {
  return <CourseDetailShell>{children}</CourseDetailShell>;
}

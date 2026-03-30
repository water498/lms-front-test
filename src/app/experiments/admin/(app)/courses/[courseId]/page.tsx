import CourseDetailFeature from "@/features/(admin)/course-detail/feature";

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function Page({ params }: Props) {
  const { courseId } = await params;
  return <CourseDetailFeature courseId={courseId} />;
}

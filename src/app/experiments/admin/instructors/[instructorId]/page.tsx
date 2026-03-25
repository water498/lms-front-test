import AdminLayout from "@/features/(admin)/_layout/admin-layout";
import InstructorDetailFeature from "@/features/(admin)/instructor-detail/feature";

interface Props {
  params: Promise<{ instructorId: string }>;
}

export default async function Page({ params }: Props) {
  const { instructorId } = await params;
  return (
    <AdminLayout>
      <InstructorDetailFeature instructorId={instructorId} />
    </AdminLayout>
  );
}

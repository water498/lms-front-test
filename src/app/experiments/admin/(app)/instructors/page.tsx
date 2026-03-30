import AdminLayout from "@/features/(admin)/_layout/admin-layout";
import InstructorsFeature from "@/features/(admin)/instructors/feature";

export default function Page() {
  return (
    <AdminLayout>
      <InstructorsFeature />
    </AdminLayout>
  );
}

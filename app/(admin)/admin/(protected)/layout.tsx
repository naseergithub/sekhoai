import AdminLayout from "@/components/admin/AdminLayout";
import AdminProviders from "@/components/admin/AdminProviders";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reviewPendingCount = await prisma.subtopic.count({
    where: { aiGenerated: true, published: false },
  });

  return (
    <AdminProviders>
      <AdminLayout reviewPendingCount={reviewPendingCount}>
        {children}
      </AdminLayout>
    </AdminProviders>
  );
}

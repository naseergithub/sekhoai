import SocialManagerPanel from "@/components/admin/SocialManagerPanel";
import { prisma } from "@/lib/db/prisma";

export default async function AdminSocialPage() {
  const [publishedSubtopics, history] = await Promise.all([
    prisma.subtopic.findMany({
      where: { published: true },
      orderBy: { title: "asc" },
      select: { id: true, title: true, slug: true, published: true },
    }),
    prisma.socialPost.findMany({
      orderBy: { generatedAt: "desc" },
      include: {
        subtopic: {
          select: { title: true, slug: true, published: true },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Social Media Manager</h1>
      <p className="text-sm text-gray-500">
        Generate and manage Urdu social posts for published subtopics
      </p>
      <SocialManagerPanel
        publishedSubtopics={publishedSubtopics}
        history={history.map((h) => ({
          ...h,
          generatedAt: h.generatedAt.toISOString(),
          postedAt: h.postedAt?.toISOString() ?? null,
        }))}
      />
    </div>
  );
}

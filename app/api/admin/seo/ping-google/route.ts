import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { getSiteUrl } from "@/lib/seo/site";

export async function POST() {
  const { error } = await requireAuth();
  if (error) return error;

  const siteUrl = getSiteUrl();
  const sitemapUrl = encodeURIComponent(`${siteUrl}/sitemap.xml`);

  try {
    await Promise.all([
      fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`),
      fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`),
    ]);

    return NextResponse.json({
      success: true,
      message: "Google اور Bing کو اطلاع دی گئی",
    });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: e instanceof Error ? e.message : "Ping failed",
      },
      { status: 500 },
    );
  }
}

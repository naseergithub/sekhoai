import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidateContent } from "@/lib/seo/revalidate";

const bodySchema = z.object({
  slug: z.string(),
  type: z.enum(["subtopic", "course", "chapter", "topic"]),
});

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = bodySchema.parse(await request.json());
    await revalidateContent(body.type, body.slug);
    revalidatePath("/sitemap.xml");
    return NextResponse.json({ revalidated: true, ...body });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid request" },
      { status: 400 },
    );
  }
}

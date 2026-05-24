import { NextResponse } from "next/server";
import { countExistingSlugs } from "@/lib/admin/csvImport";
import { readCsvFromRequest } from "@/lib/admin/importRequest";
import { requireAuth } from "@/lib/auth/guard";

export async function POST(req: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const result = await readCsvFromRequest(req);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const { parsed } = result;

    if (parsed.errors.length > 0) {
      return NextResponse.json({
        success: false,
        errors: parsed.errors,
        preview: null,
      });
    }

    const existingSlugs = await countExistingSlugs(parsed);

    return NextResponse.json({
      success: true,
      errors: [],
      preview: {
        ...parsed,
        existingSlugs,
      },
    });
  } catch (err) {
    console.error("CSV preview error:", err);
    return NextResponse.json(
      { error: "Failed to preview CSV" },
      { status: 500 },
    );
  }
}

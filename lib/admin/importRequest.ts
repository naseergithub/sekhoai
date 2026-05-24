import { parseCsvImport } from "@/lib/utils/csvParser";

export async function readCsvFromRequest(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return { error: "No file uploaded" as const, status: 400 as const };
  }

  if (!file.name.toLowerCase().endsWith(".csv")) {
    return { error: "Only CSV files are accepted" as const, status: 400 as const };
  }

  if (file.size > 5 * 1024 * 1024) {
    return {
      error: "File must not exceed 5MB" as const,
      status: 400 as const,
    };
  }

  const csvText = await file.text();
  const parsed = parseCsvImport(csvText);

  return { parsed, file };
}

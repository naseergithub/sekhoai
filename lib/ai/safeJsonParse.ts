export function cleanJsonResponse(raw: string): string {
  let cleaned = raw.trim();

  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();
  }

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  return cleaned;
}

/**
 * Escape raw control characters inside JSON string literals.
 * Gemini often returns literal newlines/tabs in Urdu content instead of \\n / \\t.
 */
export function repairJsonStringLiterals(json: string): string {
  let result = "";
  let inString = false;
  let escaped = false;

  for (let i = 0; i < json.length; i++) {
    const char = json[i]!;

    if (escaped) {
      result += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      result += char;
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      result += char;
      continue;
    }

    if (inString) {
      const code = char.charCodeAt(0);
      if (char === "\n") {
        result += "\\n";
        continue;
      }
      if (char === "\r") {
        result += "\\r";
        continue;
      }
      if (char === "\t") {
        result += "\\t";
        continue;
      }
      if (char === "\b") {
        result += "\\b";
        continue;
      }
      if (char === "\f") {
        result += "\\f";
        continue;
      }
      // Drop other ASCII control chars (invalid in JSON strings)
      if (code < 0x20) {
        continue;
      }
    }

    result += char;
  }

  return result;
}

/** Remove trailing commas before } or ]. */
export function removeTrailingCommas(json: string): string {
  return json.replace(/,(\s*[}\]])/g, "$1");
}

export function safeJsonParse<T>(raw: string, options?: { extractArray?: boolean }): T {
  let cleaned = cleanJsonResponse(raw);

  if (options?.extractArray) {
    const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
    if (arrayMatch && !cleaned.trimStart().startsWith("{")) {
      cleaned = arrayMatch[0];
    }
  }

  const attempts: string[] = [
    cleaned,
    repairJsonStringLiterals(cleaned),
    removeTrailingCommas(cleaned),
    removeTrailingCommas(repairJsonStringLiterals(cleaned)),
  ];

  let lastError: unknown;
  for (const candidate of attempts) {
    try {
      return JSON.parse(candidate) as T;
    } catch (err) {
      lastError = err;
    }
  }

  const message =
    lastError instanceof Error ? lastError.message : "Invalid JSON";
  throw new Error(`AI response parsing failed: ${message}`);
}

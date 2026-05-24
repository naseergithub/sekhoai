import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export type GeminiGenerateResult = {
  text: string;
  model: string;
};

function getGenAI(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenerativeAI(apiKey);
}

function uniqueModels(models: string[]): string[] {
  return [...new Set(models.filter(Boolean))];
}

function isRetryableGeminiError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("429") ||
    msg.includes("404") ||
    msg.includes("quota") ||
    msg.includes("Quota exceeded") ||
    msg.includes("not found") ||
    msg.includes("NOT_FOUND")
  );
}

export function formatGeminiError(err: unknown): Error {
  const message = err instanceof Error ? err.message : String(err);

  if (message.includes("429") || message.includes("quota")) {
    return new Error(
      "Gemini API quota exceeded. Free tier may not include gemini-2.5-pro — set GEMINI_MODEL_PRO=gemini-2.5-flash in .env.local or enable billing in Google AI Studio.",
    );
  }

  if (message.includes("API key") || message.includes("API_KEY")) {
    return new Error("Invalid or missing GEMINI_API_KEY");
  }

  return err instanceof Error ? err : new Error(message);
}

async function generateWithModel(
  modelName: string,
  prompt: string,
  maxOutputTokens: number,
  temperature: number,
): Promise<string> {
  const model = getGenAI().getGenerativeModel({
    model: modelName,
    safetySettings,
    generationConfig: {
      temperature,
      topP: 0.8,
      topK: 40,
      maxOutputTokens,
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  if (!response) throw new Error("No response from Gemini");

  const text = response.text();
  if (!text) throw new Error("No response from Gemini");
  return text;
}

async function generateWithFallback(
  prompt: string,
  models: string[],
  maxOutputTokens: number,
  temperature: number,
): Promise<GeminiGenerateResult> {
  let lastError: unknown = null;

  for (const modelName of uniqueModels(models)) {
    try {
      const text = await generateWithModel(
        modelName,
        prompt,
        maxOutputTokens,
        temperature,
      );
      return { text, model: modelName };
    } catch (err) {
      lastError = err;
      if (!isRetryableGeminiError(err)) {
        throw formatGeminiError(err);
      }
      console.warn(
        `[Gemini] ${modelName} unavailable, trying fallback...`,
        err instanceof Error ? err.message.slice(0, 160) : err,
      );
    }
  }

  throw formatGeminiError(lastError);
}

/** Long-form subtopic content — prefers pro, falls back to flash on quota/404. */
export async function generateWithGeminiPro(
  prompt: string,
): Promise<GeminiGenerateResult> {
  const flash = process.env.GEMINI_MODEL_FLASH ?? "gemini-2.5-flash";
  const pro = process.env.GEMINI_MODEL_PRO ?? flash;

  return generateWithFallback(
    prompt,
    [pro, flash, "gemini-2.5-flash"],
    32768,
    0.3,
  );
}

/** SEO / lighter tasks */
export async function generateWithGeminiFlash(
  prompt: string,
): Promise<GeminiGenerateResult> {
  const flash = process.env.GEMINI_MODEL_FLASH ?? "gemini-2.5-flash";

  return generateWithFallback(
    prompt,
    [flash, "gemini-2.5-flash"],
    8192,
    0.2,
  );
}

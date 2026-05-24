export type PythonCodeValidation = {
  isValid: boolean;
  issues: string[];
};

const URDU_REGEX = /[\u0600-\u06FF]/;

const BROKEN_KEYWORDS = [
  "واپس کریں",
  "اگر",
  "جبکہ",
  "کے لیے",
  "درآمد",
];

function stripQuotedStrings(line: string): string {
  return line.replace(/'[^']*'/g, "''").replace(/"[^"]*"/g, '""');
}

export function validatePythonCode(code: string): PythonCodeValidation {
  const issues: string[] = [];
  const lines = code.split("\n");

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    if (trimmed.startsWith("#") || trimmed === "") return;

    if (trimmed.startsWith("def ") && URDU_REGEX.test(trimmed)) {
      issues.push(
        `Line ${lineNum}: Function name contains Urdu — "${trimmed}"`,
      );
    }

    if (trimmed.startsWith("class ") && URDU_REGEX.test(trimmed)) {
      issues.push(
        `Line ${lineNum}: Class name contains Urdu — "${trimmed}"`,
      );
    }

    if (
      (trimmed.startsWith("import ") || trimmed.startsWith("from ")) &&
      URDU_REGEX.test(trimmed)
    ) {
      issues.push(
        `Line ${lineNum}: Import statement contains Urdu — "${trimmed}"`,
      );
    }

    const assignmentMatch = trimmed.match(/^([^='"]+)=/);
    if (assignmentMatch) {
      const leftSide = assignmentMatch[1].trim();
      if (URDU_REGEX.test(leftSide) && !leftSide.includes("[")) {
        issues.push(
          `Line ${lineNum}: Variable name contains Urdu — "${leftSide}"`,
        );
      }
    }

    const withoutStrings = stripQuotedStrings(trimmed);
    for (const keyword of BROKEN_KEYWORDS) {
      if (withoutStrings.includes(keyword)) {
        issues.push(`Line ${lineNum}: Urdu keyword found — "${keyword}"`);
      }
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
  };
}

export function hasUrduPythonSyntax(code: string | null | undefined): boolean {
  if (!code?.trim()) return false;
  return (
    /def\s+[\u0600-\u06FF]/.test(code) ||
    /class\s+[\u0600-\u06FF]/.test(code) ||
    !validatePythonCode(code).isValid
  );
}

"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/PublicThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-xl p-2 text-text-muted transition-colors hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800"
      aria-label={theme === "dark" ? "لائٹ موڈ" : "ڈارک موڈ"}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" aria-hidden />
      ) : (
        <Moon className="h-5 w-5" aria-hidden />
      )}
    </button>
  );
}

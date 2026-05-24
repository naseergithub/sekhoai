"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "🏠" },
  { href: "/admin/import", label: "CSV Import", icon: "📥" },
  { href: "/admin/courses", label: "Courses", icon: "📚" },
  { href: "/admin/chapters", label: "Chapters", icon: "📖" },
  { href: "/admin/topics", label: "Topics", icon: "📝" },
  { href: "/admin/subtopics", label: "Subtopics", icon: "🔖" },
  { href: "/admin/agent", label: "AI Agent", icon: "🤖" },
  { href: "/admin/agent/review", label: "Review Queue", icon: "✅", badge: true },
  { href: "/admin/seo", label: "SEO Manager", icon: "📊" },
  { href: "/admin/social", label: "Social Media", icon: "📱" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminLayout({
  children,
  reviewPendingCount = 0,
}: {
  children: React.ReactNode;
  reviewPendingCount?: number;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="fixed inset-y-0 left-0 z-40 w-60 border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center border-b border-gray-200 px-4">
          <Link href="/admin" className="text-lg font-bold text-gray-900">
            Sekhain AI — Admin
          </Link>
        </div>
        <nav className="space-y-1 p-3">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : item.href === "/admin/agent"
                  ? pathname === "/admin/agent"
                  : pathname.startsWith(item.href);

            const showBadge =
              item.badge && reviewPendingCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <span className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  {item.label}
                  {showBadge && (
                    <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {reviewPendingCount}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="ml-60 flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <span className="text-sm font-medium text-gray-500">Admin Panel</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Logged in as: {session?.user?.email ?? "…"}
            </span>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

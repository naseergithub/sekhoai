import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";

export async function requirePageAuth() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  const role = session.user.role;
  if (role !== "ADMIN" && role !== "EDITOR") {
    redirect("/admin/login");
  }

  return session;
}

export async function requireAuth() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const role = session.user.role;
  if (role !== "ADMIN" && role !== "EDITOR") {
    return {
      session: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { session, error: null };
}

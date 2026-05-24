import { cache } from "react";
import { auth } from "@/lib/auth";

/** Deduplicate auth() within a single server request (RSC, layouts). */
export const getServerSession = cache(async () => auth());

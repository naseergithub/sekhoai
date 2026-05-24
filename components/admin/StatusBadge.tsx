import { cn } from "@/lib/utils";

export function PublishBadge({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        published
          ? "bg-emerald-100 text-emerald-800"
          : "bg-gray-100 text-gray-600",
      )}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}

export function AgentStatusBadge({
  status,
}: {
  status: "PENDING" | "SUCCESS" | "FAILED";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        status === "SUCCESS" && "bg-emerald-100 text-emerald-800",
        status === "PENDING" && "bg-amber-100 text-amber-800",
        status === "FAILED" && "bg-red-100 text-red-800",
      )}
    >
      {status === "SUCCESS" ? "Success" : status === "FAILED" ? "Failed" : "Pending"}
    </span>
  );
}

import { cn } from "@/lib/utils";
import { Status } from "@/types";

interface StatusDotProps {
  status: Status;
  size?: "sm" | "md";
}

export function StatusDot({ status, size = "md" }: StatusDotProps) {
  return (
    <span
      className={cn(
        "rounded-full inline-block",
        size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5",
        status === "green" && "bg-emerald-500",
        status === "yellow" && "bg-amber-500",
        status === "red" && "bg-red-500"
      )}
    />
  );
}

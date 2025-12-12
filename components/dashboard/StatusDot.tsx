import { cn } from "@/lib/utils";
import { Status } from "@/types";

interface StatusDotProps {
  status: Status;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}

export function StatusDot({ status, size = "md", pulse }: StatusDotProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
  };

  return (
    <span className="relative inline-flex">
      <span
        className={cn(
          "rounded-full inline-block",
          sizeClasses[size],
          status === "green" && "bg-emerald-500",
          status === "yellow" && "bg-amber-500",
          status === "red" && "bg-red-500"
        )}
      />
      {pulse && status === "red" && (
        <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
      )}
    </span>
  );
}

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    green: { bg: "bg-emerald-50", text: "text-emerald-700", label: "OK" },
    yellow: { bg: "bg-amber-50", text: "text-amber-700", label: "Prüfen" },
    red: { bg: "bg-red-50", text: "text-red-700", label: "Kritisch" },
  };

  const c = config[status];

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", c.bg, c.text)}>
      <StatusDot status={status} size="sm" />
      {c.label}
    </span>
  );
}

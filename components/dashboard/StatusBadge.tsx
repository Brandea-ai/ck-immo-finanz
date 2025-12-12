import { cn } from "@/lib/utils";
import { Status } from "@/types";

interface StatusBadgeProps {
  status: Status;
  text?: string;
}

export function StatusBadge({ status, text }: StatusBadgeProps) {
  const config = {
    ok: {
      bg: "bg-green-100",
      text: "text-green-800",
      dot: "bg-green-500",
      label: "OK",
    },
    warning: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      dot: "bg-yellow-500",
      label: "Warnung",
    },
    critical: {
      bg: "bg-red-100",
      text: "text-red-800",
      dot: "bg-red-500",
      label: "Kritisch",
    },
  };

  const c = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        c.bg,
        c.text
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {text || c.label}
    </span>
  );
}

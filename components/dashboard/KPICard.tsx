import { cn } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
  variant?: "default" | "highlight" | "gold";
  icon?: React.ReactNode;
}

export function KPICard({ label, value, subtext, trend, variant = "default", icon }: KPICardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover-lift",
        variant === "default" && "bg-white border border-gray-100 shadow-sm",
        variant === "highlight" && "bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200",
        variant === "gold" && "card-premium-dark"
      )}
    >
      {/* Background decoration */}
      {variant === "gold" && (
        <div className="absolute top-0 right-0 w-32 h-32 gold-gradient opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
      )}

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <p className={cn(
            "text-xs font-medium uppercase tracking-wider",
            variant === "gold" ? "text-slate-400" : "text-slate-500"
          )}>
            {label}
          </p>
          {icon && (
            <div className={cn(
              "p-2 rounded-lg",
              variant === "gold" ? "bg-white/10" : "bg-slate-100"
            )}>
              {icon}
            </div>
          )}
        </div>

        <p className={cn(
          "text-3xl font-semibold tracking-tight",
          variant === "highlight" && "text-red-600",
          variant === "gold" && "text-white"
        )}>
          {value}
        </p>

        {subtext && (
          <div className="flex items-center gap-2 mt-2">
            {trend && (
              <span className={cn(
                "inline-flex items-center text-xs font-medium",
                trend === "up" && "text-emerald-600",
                trend === "down" && "text-red-600"
              )}>
                {trend === "up" ? "↑" : trend === "down" ? "↓" : ""}
              </span>
            )}
            <p className={cn(
              "text-sm",
              variant === "gold" ? "text-slate-400" : "text-slate-500"
            )}>
              {subtext}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface KPICardProps {
  label: string;
  value: string | number;
  subtext?: string;
  highlight?: boolean;
}

export function KPICard({ label, value, subtext, highlight }: KPICardProps) {
  return (
    <div className={`p-4 rounded-lg border ${highlight ? "border-red-200 bg-red-50" : "bg-white"}`}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${highlight ? "text-red-600" : ""}`}>
        {value}
      </p>
      {subtext && (
        <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
      )}
    </div>
  );
}

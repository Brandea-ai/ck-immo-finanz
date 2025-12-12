"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  Euro,
  Users,
  AlertTriangle,
  AlertCircle,
  UserPlus,
  CheckCircle2,
} from "lucide-react";

interface KPICardsProps {
  totalVolume: number;
  totalKunden: number;
  criticalCount: number;
  warningCount: number;
  newLeads: number;
  closedThisMonth: number;
}

export function KPICards({
  totalVolume,
  totalKunden,
  criticalCount,
  warningCount,
  newLeads,
  closedThisMonth,
}: KPICardsProps) {
  const kpis = [
    {
      label: "Pipeline-Gesamtwert",
      value: formatCurrency(totalVolume),
      icon: Euro,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Aktive Kunden",
      value: totalKunden.toString(),
      icon: Users,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
    },
    {
      label: "Kritische Fälle",
      value: criticalCount.toString(),
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "Warnungen",
      value: warningCount.toString(),
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Neue Leads",
      value: newLeads.toString(),
      icon: UserPlus,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Abschlüsse",
      value: closedThisMonth.toString(),
      icon: CheckCircle2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${kpi.bgColor}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-lg font-bold">{kpi.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

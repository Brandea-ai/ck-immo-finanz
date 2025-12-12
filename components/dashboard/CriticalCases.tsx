"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { Kunde, PHASES } from "@/types";
import { AlertCircle, Phone, MessageCircle } from "lucide-react";

interface CriticalCasesProps {
  kunden: Kunde[];
}

export function CriticalCases({ kunden }: CriticalCasesProps) {
  const criticalKunden = kunden.filter(
    (k) => k.status === "critical" || k.status === "warning"
  );

  if (criticalKunden.length === 0) {
    return null;
  }

  return (
    <Card className="border-red-200 bg-red-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          Kritische Fälle ({criticalKunden.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {criticalKunden.map((kunde) => {
            const phase = PHASES.find((p) => p.id === kunde.phase);
            return (
              <div
                key={kunde.id}
                className="flex items-center justify-between rounded-lg bg-white p-3 border"
              >
                <div className="flex items-center gap-4">
                  <StatusBadge status={kunde.status} />
                  <div>
                    <p className="font-medium">{kunde.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Phase {kunde.phase}: {phase?.name} •{" "}
                      {formatCurrency(kunde.financingVolume)}
                    </p>
                    {kunde.statusText && (
                      <p className="text-sm text-red-600 font-medium mt-1">
                        {kunde.statusText}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm">Details</Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

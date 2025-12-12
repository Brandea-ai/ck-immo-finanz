"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { Kunde, PHASES } from "@/types";
import { ChevronRight } from "lucide-react";

interface PipelineViewProps {
  kunden: Kunde[];
}

export function PipelineView({ kunden }: PipelineViewProps) {
  const getKundenForPhase = (phaseId: number) => {
    return kunden.filter((k) => k.phase === phaseId);
  };

  const getPhaseVolume = (phaseId: number) => {
    return getKundenForPhase(phaseId).reduce(
      (sum, k) => sum + k.financingVolume,
      0
    );
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {PHASES.map((phase) => {
          const phaseKunden = getKundenForPhase(phase.id);
          const phaseVolume = getPhaseVolume(phase.id);

          return (
            <div key={phase.id} className="w-72 flex-shrink-0">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-3 w-3 rounded-full ${phase.color}`}
                    />
                    <CardTitle className="text-sm font-medium">
                      {phase.id}. {phase.name}
                    </CardTitle>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {phase.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      {phaseKunden.length} Kunden
                    </span>
                    <span className="text-xs font-medium text-blue-600">
                      {formatCurrency(phaseVolume)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {phaseKunden.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Keine Kunden
                    </p>
                  ) : (
                    phaseKunden.map((kunde) => (
                      <div
                        key={kunde.id}
                        className="rounded-lg border p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm">{kunde.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatCurrency(kunde.financingVolume)}
                            </p>
                          </div>
                          <StatusBadge status={kunde.status} />
                        </div>
                        {kunde.nextAction && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <ChevronRight className="h-3 w-3 text-blue-600" />
                            <span className="truncate">{kunde.nextAction}</span>
                          </div>
                        )}
                        {kunde.berater && (
                          <div className="flex items-center gap-1 mt-2 pt-2 border-t">
                            <div className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-medium">
                              {kunde.berater.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {kunde.berater.name}
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

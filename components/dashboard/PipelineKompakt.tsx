import { Kunde, PHASEN } from "@/types";
import { StatusDot } from "./StatusDot";

interface PipelineKompaktProps {
  kunden: Kunde[];
}

function formatEuro(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PipelineKompakt({ kunden }: PipelineKompaktProps) {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="px-4 py-3 border-b">
        <h3 className="font-medium text-sm">Pipeline-Übersicht</h3>
      </div>
      <div className="overflow-x-auto">
        <div className="flex min-w-max">
          {PHASEN.map((phase) => {
            const phasenKunden = kunden.filter((k) => k.phase === phase.id);
            const volumen = phasenKunden.reduce(
              (s, k) => s + k.finanzierungsvolumen,
              0
            );

            return (
              <div
                key={phase.id}
                className="w-44 shrink-0 border-r last:border-r-0"
              >
                {/* Header */}
                <div className="px-3 py-2 border-b bg-muted/30">
                  <p className="text-xs font-medium truncate">
                    {phase.id}. {phase.name}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-muted-foreground">
                      {phasenKunden.length} Fälle
                    </span>
                    <span className="text-[10px] font-medium">
                      {formatEuro(volumen)}
                    </span>
                  </div>
                </div>

                {/* Kunden */}
                <div className="p-2 space-y-1 min-h-[120px] max-h-[240px] overflow-y-auto">
                  {phasenKunden.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      –
                    </p>
                  ) : (
                    phasenKunden.map((kunde) => (
                      <div
                        key={kunde.id}
                        className="px-2 py-1.5 rounded border bg-white hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <StatusDot status={kunde.status} size="sm" />
                          <span className="text-xs font-medium truncate">
                            {kunde.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate pl-3.5">
                          {formatEuro(kunde.finanzierungsvolumen)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

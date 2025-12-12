import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatusDot } from "@/components/dashboard/StatusDot";
import { kunden, getKPIs, getBeraterById } from "@/lib/demo-data";
import { PHASEN } from "@/types";

function formatEuro(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PipelinePage() {
  const kpis = getKPIs();

  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="h-14 px-6 flex items-center justify-between border-b bg-white sticky top-0 z-10">
          <div>
            <h1 className="font-semibold">Pipeline</h1>
            <p className="text-xs text-muted-foreground">
              11 Phasen · {kunden.length} Fälle · {formatEuro(kpis.pipelineWert)}
            </p>
          </div>
        </header>

        {/* Pipeline Board */}
        <div className="p-6 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {PHASEN.map((phase) => {
              const phasenKunden = kunden.filter((k) => k.phase === phase.id);
              const volumen = phasenKunden.reduce(
                (s, k) => s + k.finanzierungsvolumen,
                0
              );

              return (
                <div
                  key={phase.id}
                  className="w-64 shrink-0 bg-white rounded-lg border"
                >
                  {/* Phase Header */}
                  <div className="p-3 border-b">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                        {phase.id}
                      </span>
                      <h3 className="font-medium text-sm truncate">
                        {phase.name}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {phase.beschreibung}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t">
                      <span className="text-xs text-muted-foreground">
                        {phasenKunden.length} Fälle
                      </span>
                      <span className="text-xs font-medium">
                        {formatEuro(volumen)}
                      </span>
                    </div>
                  </div>

                  {/* Kunden */}
                  <div className="p-2 space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto">
                    {phasenKunden.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-8">
                        Keine Fälle
                      </p>
                    ) : (
                      phasenKunden.map((kunde) => {
                        const berater = getBeraterById(kunde.beraterId);
                        return (
                          <div
                            key={kunde.id}
                            className="p-3 rounded-md border hover:border-primary/50 hover:shadow-sm cursor-pointer transition-all"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <StatusDot status={kunde.status} />
                                <span className="font-medium text-sm truncate">
                                  {kunde.name}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatEuro(kunde.finanzierungsvolumen)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {kunde.naechsteAktion}
                            </p>
                            {kunde.fehlendeDokumente.length > 0 && (
                              <p className="text-xs text-red-600 mt-1">
                                {kunde.fehlendeDokumente.length} Dokumente
                                fehlen
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-2 pt-2 border-t">
                              <span className="text-[10px] text-muted-foreground">
                                {berater?.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {kunde.tageInPhase}d
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

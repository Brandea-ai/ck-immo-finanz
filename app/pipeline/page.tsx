import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatusDot } from "@/components/dashboard/StatusDot";
import { kunden, getKPIs, getBeraterById } from "@/lib/demo-data";
import { PHASEN } from "@/types";
import { cn } from "@/lib/utils";

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
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Pipeline</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              11 Phasen · {kunden.length} Fälle · {formatEuro(kpis.pipelineWert)}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <StatusDot status="green" />
                <span className="text-sm text-slate-600">OK</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot status="yellow" />
                <span className="text-sm text-slate-600">Prüfen</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot status="red" />
                <span className="text-sm text-slate-600">Kritisch</span>
              </div>
            </div>
          </div>
        </header>

        {/* Pipeline Board */}
        <div className="p-6 overflow-x-auto h-[calc(100vh-80px)]">
          <div className="flex gap-4 min-w-max h-full">
            {PHASEN.map((phase) => {
              const phasenKunden = kunden.filter((k) => k.phase === phase.id);
              const volumen = phasenKunden.reduce(
                (s, k) => s + k.finanzierungsvolumen,
                0
              );
              const hasKritisch = phasenKunden.some((k) => k.status === "red");

              return (
                <div
                  key={phase.id}
                  className={cn(
                    "w-72 shrink-0 rounded-xl border flex flex-col",
                    hasKritisch
                      ? "bg-red-50/50 border-red-200"
                      : "bg-white border-gray-100"
                  )}
                >
                  {/* Phase Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-8 h-8 rounded-lg gold-gradient text-white text-sm font-bold flex items-center justify-center shadow-md">
                        {phase.id}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {phase.name}
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">
                      {phase.beschreibung}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-sm text-slate-500">
                        {phasenKunden.length} {phasenKunden.length === 1 ? "Fall" : "Fälle"}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatEuro(volumen)}
                      </span>
                    </div>
                  </div>

                  {/* Kunden */}
                  <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                    {phasenKunden.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-sm">Keine Fälle</p>
                      </div>
                    ) : (
                      phasenKunden.map((kunde) => {
                        const berater = getBeraterById(kunde.beraterId);
                        return (
                          <div
                            key={kunde.id}
                            className={cn(
                              "p-4 rounded-xl border bg-white cursor-pointer transition-all duration-200",
                              "hover:shadow-lg hover:border-amber-300 hover:-translate-y-1",
                              kunde.status === "red" && "border-red-300 bg-red-50"
                            )}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <StatusDot status={kunde.status} size="md" pulse={kunde.status === "red"} />
                                <span className="font-semibold text-gray-900">
                                  {kunde.name}
                                </span>
                              </div>
                              <span className={cn(
                                "text-xs font-medium px-2 py-0.5 rounded-full",
                                kunde.tageInPhase >= 5 ? "bg-red-100 text-red-700" :
                                kunde.tageInPhase >= 3 ? "bg-amber-100 text-amber-700" :
                                "bg-slate-100 text-slate-600"
                              )}>
                                {kunde.tageInPhase}d
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900 mb-2">
                              {formatEuro(kunde.finanzierungsvolumen)}
                            </p>
                            {kunde.naechsteAktion && (
                              <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                {kunde.naechsteAktion}
                              </p>
                            )}
                            {kunde.fehlendeDokumente.length > 0 && (
                              <div className="mb-3">
                                <p className="text-xs text-red-600 font-medium mb-1">
                                  Fehlende Dokumente:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {kunde.fehlendeDokumente.slice(0, 2).map((doc) => (
                                    <span key={doc} className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                                      {doc}
                                    </span>
                                  ))}
                                  {kunde.fehlendeDokumente.length > 2 && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                                      +{kunde.fehlendeDokumente.length - 2}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600">
                                  {berater?.name.split(" ").map((n) => n[0]).join("")}
                                </div>
                                <span className="text-xs text-slate-500">
                                  {berater?.name}
                                </span>
                              </div>
                              <span className="text-xs text-slate-400">
                                {kunde.objectType}
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

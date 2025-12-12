"use client";

import { Kunde, PHASEN } from "@/types";
import { StatusDot } from "./StatusDot";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

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
  const { getBeraterById } = useStore();
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Pipeline-Übersicht</h3>
          <p className="text-xs text-slate-500 mt-0.5">11 Phasen im Finanzierungsprozess</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <StatusDot status="green" size="sm" />
            <span className="text-slate-500">OK</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot status="yellow" size="sm" />
            <span className="text-slate-500">Prüfen</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot status="red" size="sm" />
            <span className="text-slate-500">Kritisch</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="flex min-w-max">
          {PHASEN.map((phase, index) => {
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
                  "w-52 shrink-0 border-r border-gray-100 last:border-r-0",
                  hasKritisch && "bg-red-50/30"
                )}
              >
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100 bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-lg gold-gradient text-white text-xs font-bold flex items-center justify-center shadow-sm">
                      {phase.id}
                    </span>
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {phase.name}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-500">
                      {phasenKunden.length} {phasenKunden.length === 1 ? "Fall" : "Fälle"}
                    </span>
                    <span className="text-xs font-semibold text-gray-900">
                      {formatEuro(volumen)}
                    </span>
                  </div>
                </div>

                {/* Kunden */}
                <div className="p-2 space-y-2 min-h-[160px] max-h-[280px] overflow-y-auto">
                  {phasenKunden.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-slate-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                  ) : (
                    phasenKunden.map((kunde) => {
                      const berater = getBeraterById(kunde.beraterId);
                      return (
                        <div
                          key={kunde.id}
                          className={cn(
                            "p-3 rounded-lg border bg-white cursor-pointer transition-all duration-200",
                            "hover:shadow-md hover:border-amber-300 hover:-translate-y-0.5",
                            kunde.status === "red" && "border-red-300 bg-red-50/50"
                          )}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <StatusDot status={kunde.status} size="sm" pulse={kunde.status === "red"} />
                            <span className="font-medium text-sm text-gray-900 truncate">
                              {kunde.name}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-gray-700">
                            {formatEuro(kunde.finanzierungsvolumen)}
                          </p>
                          {kunde.naechsteAktion && (
                            <p className="text-[11px] text-slate-500 mt-1 truncate">
                              {kunde.naechsteAktion}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                            <span className="text-[10px] text-slate-400 truncate">
                              {berater?.name}
                            </span>
                            <span className={cn(
                              "text-[10px] font-medium",
                              kunde.tageInPhase >= 5 ? "text-red-600" :
                              kunde.tageInPhase >= 3 ? "text-amber-600" : "text-slate-400"
                            )}>
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
    </div>
  );
}

"use client";

import { Kunde, PHASEN } from "@/types";
import { StatusDot, StatusBadge } from "./StatusDot";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface FallListeProps {
  faelle: Kunde[];
  titel?: string;
  variant?: "default" | "critical";
}

function formatEuro(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function FallListe({ faelle, titel, variant = "default" }: FallListeProps) {
  const { getBeraterById } = useStore();
  if (faelle.length === 0) return null;

  return (
    <div className={cn(
      "rounded-xl overflow-hidden",
      variant === "critical"
        ? "bg-gradient-to-br from-red-50 to-white border border-red-200"
        : "bg-white border border-gray-100 shadow-sm"
    )}>
      {titel && (
        <div className={cn(
          "px-5 py-4 border-b",
          variant === "critical" ? "border-red-200" : "border-gray-100"
        )}>
          <div className="flex items-center gap-3">
            {variant === "critical" && (
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            )}
            <div>
              <h3 className={cn(
                "font-semibold",
                variant === "critical" ? "text-red-900" : "text-gray-900"
              )}>{titel}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sofortige Aufmerksamkeit erforderlich
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="divide-y divide-gray-100">
        {faelle.map((fall, index) => {
          const phase = PHASEN.find((p) => p.id === fall.phase);
          const berater = getBeraterById(fall.beraterId);

          return (
            <div
              key={fall.id}
              className="px-5 py-4 hover:bg-slate-50/50 transition-colors cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="mt-1">
                    <StatusDot status={fall.status} size="lg" pulse={fall.status === "red"} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-gray-900">{fall.name}</p>
                      <StatusBadge status={fall.status} />
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      Phase {fall.phase}: {phase?.name}
                    </p>
                    {fall.naechsteAktion && (
                      <p className="text-sm text-slate-600 mt-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        {fall.naechsteAktion}
                      </p>
                    )}
                    {fall.fehlendeDokumente.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {fall.fehlendeDokumente.map((doc) => (
                          <span key={doc} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">
                            {doc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-semibold text-gray-900">
                    {formatEuro(fall.finanzierungsvolumen)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {berater?.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {fall.tageInPhase} Tage in Phase
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

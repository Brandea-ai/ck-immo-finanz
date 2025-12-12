import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatusDot, StatusBadge } from "@/components/dashboard/StatusDot";
import { kunden, getBeraterById, getKPIs } from "@/lib/demo-data";
import { PHASEN } from "@/types";
import { cn } from "@/lib/utils";

function formatEuro(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function KundenPage() {
  const kpis = getKPIs();

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Kunden</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {kunden.length} Fälle · {formatEuro(kpis.pipelineWert)} Pipeline-Wert
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Suchen..."
                className="w-64 h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
            <button className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
            </button>
            <button className="h-10 px-4 rounded-xl gold-gradient text-white text-sm font-medium shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:-translate-y-0.5">
              + Neuer Kunde
            </button>
          </div>
        </header>

        {/* Table */}
        <div className="p-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-slate-50/50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kunde</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Phase</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Volumen</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Objekttyp</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Berater</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tage</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nächste Aktion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {kunden.map((kunde, index) => {
                  const phase = PHASEN.find((p) => p.id === kunde.phase);
                  const berater = getBeraterById(kunde.beraterId);

                  return (
                    <tr
                      key={kunde.id}
                      className="hover:bg-amber-50/30 cursor-pointer transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="px-6 py-4">
                        <StatusBadge status={kunde.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{kunde.name}</p>
                          <p className="text-sm text-slate-500">{kunde.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded gold-gradient text-white text-xs font-bold flex items-center justify-center">
                            {kunde.phase}
                          </span>
                          <span className="text-sm text-gray-700">{phase?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          {formatEuro(kunde.finanzierungsvolumen)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 px-2 py-1 rounded-lg bg-slate-100">
                          {kunde.objectType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                            {berater?.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="text-sm text-slate-600">{berater?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "text-sm font-medium px-2.5 py-1 rounded-lg",
                            kunde.tageInPhase >= 5
                              ? "bg-red-100 text-red-700"
                              : kunde.tageInPhase >= 3
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          )}
                        >
                          {kunde.tageInPhase} Tage
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-[200px]">
                          <p className="text-sm text-slate-600 truncate">
                            {kunde.naechsteAktion}
                          </p>
                          {kunde.fehlendeDokumente.length > 0 && (
                            <p className="text-xs text-red-600 mt-1">
                              {kunde.fehlendeDokumente.length} Dok. fehlen
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

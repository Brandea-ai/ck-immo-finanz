"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatusDot, StatusBadge } from "@/components/dashboard/StatusDot";
import { useStore } from "@/lib/store";
import { PHASEN, Status } from "@/types";
import { KundeDetailModal } from "@/components/kunde/KundeDetailModal";
import { KundeFormModal } from "@/components/kunde/KundeFormModal";
import { cn } from "@/lib/utils";

function formatEuro(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function KundenPage() {
  const {
    getFilteredKunden,
    getKPIs,
    getBeraterById,
    team,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterBerater,
    setFilterBerater,
    filterPhase,
    setFilterPhase,
  } = useStore();

  const kpis = getKPIs();
  const kunden = getFilteredKunden();
  const beraters = team.filter((t) => t.role === "GF" || t.role === "BERATER");

  const [selectedKunde, setSelectedKunde] = useState<typeof kunden[0] | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = filterStatus !== "all" || filterBerater !== "all" || filterPhase !== "all";

  const clearFilters = () => {
    setFilterStatus("all");
    setFilterBerater("all");
    setFilterPhase("all");
    setSearchQuery("");
  };

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
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "h-10 px-4 rounded-xl border text-sm font-medium transition-colors flex items-center gap-2",
                hasActiveFilters
                  ? "border-amber-300 bg-amber-50 text-amber-700"
                  : "border-gray-200 bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="h-10 px-4 rounded-xl gold-gradient text-white text-sm font-medium shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:-translate-y-0.5"
            >
              + Neuer Kunde
            </button>
          </div>
        </header>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-8 py-4 bg-slate-50 border-b border-gray-200"
          >
            <div className="flex items-center gap-6">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as Status | "all")}
                  className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="all">Alle</option>
                  <option value="green">OK</option>
                  <option value="yellow">Warnung</option>
                  <option value="red">Kritisch</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Berater</label>
                <select
                  value={filterBerater}
                  onChange={(e) => setFilterBerater(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="all">Alle</option>
                  {beraters.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Phase</label>
                <select
                  value={filterPhase === "all" ? "all" : String(filterPhase)}
                  onChange={(e) =>
                    setFilterPhase(e.target.value === "all" ? "all" : Number(e.target.value))
                  }
                  className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="all">Alle</option>
                  {PHASEN.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id}. {p.name}
                    </option>
                  ))}
                </select>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="h-9 px-3 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Filter zurücksetzen
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Table */}
        <div className="p-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-slate-50/50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Kunde
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Phase
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Volumen
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Objekttyp
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Berater
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Tage
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Nächste Aktion
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {kunden.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                      <svg
                        className="w-12 h-12 mx-auto mb-3 text-slate-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <p>Keine Kunden gefunden</p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="mt-2 text-amber-600 hover:text-amber-700"
                        >
                          Filter zurücksetzen
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  kunden.map((kunde, index) => {
                    const phase = PHASEN.find((p) => p.id === kunde.phase);
                    const berater = getBeraterById(kunde.beraterId);

                    return (
                      <motion.tr
                        key={kunde.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => setSelectedKunde(kunde)}
                        className="hover:bg-amber-50/30 cursor-pointer transition-colors"
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
                              {berater?.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
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
                            <p className="text-sm text-slate-600 truncate">{kunde.naechsteAktion}</p>
                            {kunde.fehlendeDokumente.length > 0 && (
                              <p className="text-xs text-red-600 mt-1">
                                {kunde.fehlendeDokumente.length} Dok. fehlen
                              </p>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modals */}
      {selectedKunde && (
        <KundeDetailModal
          kunde={selectedKunde}
          isOpen={!!selectedKunde}
          onClose={() => setSelectedKunde(null)}
        />
      )}

      {showCreateModal && (
        <KundeFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          mode="create"
        />
      )}
    </div>
  );
}

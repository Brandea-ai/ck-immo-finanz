"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { KPICard } from "@/components/dashboard/KPICard";
import { StatusDot, StatusBadge } from "@/components/dashboard/StatusDot";
import { useStore } from "@/lib/store";
import { PHASEN } from "@/types";
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

export default function Dashboard() {
  const {
    kunden,
    getKPIs,
    getDetailedKPIs,
    getStauWarnungen,
    getBeraterById,
    searchQuery,
    setSearchQuery,
    recalculateAllStatuses,
  } = useStore();

  const kpis = getKPIs();
  const detailedKpis = getDetailedKPIs();
  const stauWarnungen = getStauWarnungen();

  const [selectedKunde, setSelectedKunde] = useState<typeof kunden[0] | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const kritischeFaelle = kunden.filter((k) => k.status === "red");
  const warnungsFaelle = kunden.filter((k) => k.status === "yellow");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {new Date().toLocaleDateString("de-DE", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
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
                placeholder="Kunde suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl border border-gray-200 hover:bg-slate-50 transition-colors">
              <svg
                className="w-5 h-5 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {kritischeFaelle.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
            {/* Add Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="h-10 px-4 rounded-xl gold-gradient text-white text-sm font-medium shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:-translate-y-0.5"
            >
              + Neuer Kunde
            </button>
          </div>
        </header>

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-8 space-y-8"
        >
          {/* KPI Section */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 gold-gradient rounded-full" />
              <h2 className="text-lg font-semibold text-gray-900">Übersicht</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KPICard
                label="Pipeline-Wert"
                value={formatEuro(kpis.pipelineWert)}
                variant="gold"
                subtext="Gesamtvolumen"
              />
              <KPICard label="Aktive Fälle" value={kpis.aktiveFaelle} subtext="In Bearbeitung" />
              <KPICard
                label="Kritische Fälle"
                value={kpis.kritischeFaelle}
                variant={kpis.kritischeFaelle > 0 ? "highlight" : "default"}
                subtext="Sofort handeln"
              />
              <KPICard label="Abschlüsse" value={kpis.abschluesse} subtext="Diesen Monat" trend="up" />
            </div>
          </motion.div>

          {/* Secondary KPIs */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard label="Warnungen" value={kpis.warnungen} subtext="Berater prüfen" />
            <KPICard label="Neue Leads" value={kpis.neueLeads} subtext="Erstkontakt" />
            <KPICard
              label="Stau-Fälle"
              value={stauWarnungen.length}
              subtext="> erwartete Zeit"
              variant={stauWarnungen.length > 0 ? "highlight" : "default"}
            />
            <KPICard label="Durchlaufzeit" value={`${kpis.durchlaufzeit}d`} subtext="Phase 1-3 Ø" />
          </motion.div>

          {/* Process Quality */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              label="Unterlagen komplett"
              value={`${detailedKpis.unterlagenVollstaendig}%`}
              subtext="aller aktiven Fälle"
            />
            <KPICard
              label="Red Flag Rate"
              value={`${detailedKpis.redFlagRate}%`}
              subtext="Fälle mit Problemen"
              variant={detailedKpis.redFlagRate > 30 ? "highlight" : "default"}
            />
            <KPICard label="OK Fälle" value={detailedKpis.okFaelle} subtext="Läuft planmäßig" />
            <KPICard
              label="Team-Auslastung"
              value={Object.keys(detailedKpis.faelleProBerater).length}
              subtext="Berater aktiv"
            />
          </motion.div>

          {/* Critical Cases */}
          {kritischeFaelle.length > 0 && (
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-red-500 rounded-full" />
                <h2 className="text-lg font-semibold text-gray-900">Kritische Fälle</h2>
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                  {kritischeFaelle.length}
                </span>
              </div>
              <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {kritischeFaelle.map((kunde) => {
                    const berater = getBeraterById(kunde.beraterId);
                    const phase = PHASEN.find((p) => p.id === kunde.phase);
                    return (
                      <motion.div
                        key={kunde.id}
                        whileHover={{ backgroundColor: "rgba(254, 202, 202, 0.3)" }}
                        onClick={() => setSelectedKunde(kunde)}
                        className="p-4 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <StatusDot status="red" size="lg" pulse />
                            <div>
                              <p className="font-semibold text-gray-900">{kunde.name}</p>
                              <p className="text-sm text-slate-500">{phase?.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {formatEuro(kunde.finanzierungsvolumen)}
                              </p>
                              <p className="text-sm text-slate-500">{berater?.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-red-600 font-medium">
                                {kunde.tageInPhase} Tage
                              </p>
                              <p className="text-xs text-slate-500">in Phase</p>
                            </div>
                            <svg
                              className="w-5 h-5 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                        {kunde.redFlags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {kunde.redFlags.map((flag, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 rounded-lg bg-red-100 text-red-700"
                              >
                                {flag}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Warnings */}
          {warnungsFaelle.length > 0 && (
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-amber-500 rounded-full" />
                <h2 className="text-lg font-semibold text-gray-900">Warnungen</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                  {warnungsFaelle.length}
                </span>
              </div>
              <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {warnungsFaelle.map((kunde) => {
                    const berater = getBeraterById(kunde.beraterId);
                    const phase = PHASEN.find((p) => p.id === kunde.phase);
                    return (
                      <motion.div
                        key={kunde.id}
                        whileHover={{ backgroundColor: "rgba(254, 243, 199, 0.3)" }}
                        onClick={() => setSelectedKunde(kunde)}
                        className="p-4 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <StatusDot status="yellow" size="lg" />
                            <div>
                              <p className="font-semibold text-gray-900">{kunde.name}</p>
                              <p className="text-sm text-slate-500">{phase?.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {formatEuro(kunde.finanzierungsvolumen)}
                              </p>
                              <p className="text-sm text-slate-500">{berater?.name}</p>
                            </div>
                            <p className="text-sm text-amber-600">{kunde.naechsteAktion}</p>
                            <svg
                              className="w-5 h-5 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Stau-Warnungen */}
          {stauWarnungen.length > 0 && (
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-orange-500 rounded-full" />
                <h2 className="text-lg font-semibold text-gray-900">Stau erkannt</h2>
                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                  {stauWarnungen.length}
                </span>
              </div>
              <div className="bg-white rounded-xl border border-orange-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {stauWarnungen.slice(0, 5).map((warnung) => {
                    const kunde = kunden.find((k) => k.id === warnung.kundeId);
                    const phase = PHASEN.find((p) => p.id === warnung.phase);
                    return (
                      <div
                        key={warnung.kundeId}
                        onClick={() => kunde && setSelectedKunde(kunde)}
                        className="p-4 hover:bg-orange-50/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                              <span className="text-orange-700 font-bold text-sm">
                                {warnung.tageInPhase}d
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{warnung.kundeName}</p>
                              <p className="text-sm text-slate-500">Phase {warnung.phase}: {phase?.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-orange-700 font-medium">{warnung.grund}</p>
                            <p className="text-xs text-slate-500 mt-1">{warnung.empfehlung}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Pipeline Overview */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 gold-gradient rounded-full" />
                <h2 className="text-lg font-semibold text-gray-900">Pipeline-Übersicht</h2>
              </div>
              <a
                href="/pipeline"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
              >
                Zur Pipeline
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="grid grid-cols-11 gap-2">
                {PHASEN.map((phase) => {
                  const count = kunden.filter((k) => k.phase === phase.id).length;
                  const hasKritisch = kunden.some(
                    (k) => k.phase === phase.id && k.status === "red"
                  );
                  return (
                    <div key={phase.id} className="text-center">
                      <div
                        className={cn(
                          "w-10 h-10 mx-auto rounded-lg flex items-center justify-center text-sm font-bold mb-2",
                          hasKritisch
                            ? "bg-red-100 text-red-700"
                            : count > 0
                            ? "gold-gradient text-white"
                            : "bg-slate-100 text-slate-400"
                        )}
                      >
                        {count}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{phase.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
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

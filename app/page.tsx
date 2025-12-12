import { Sidebar } from "@/components/dashboard/Sidebar";
import { KPICard } from "@/components/dashboard/KPICard";
import { FallListe } from "@/components/dashboard/FallListe";
import { PipelineKompakt } from "@/components/dashboard/PipelineKompakt";
import { kunden, getKPIs } from "@/lib/demo-data";

function formatEuro(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Dashboard() {
  const kpis = getKPIs();
  const kritischeFaelle = kunden.filter((k) => k.status === "red");
  const warnungsFaelle = kunden.filter((k) => k.status === "yellow");

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
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Kunde suchen..."
                className="w-64 h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl border border-gray-200 hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            {/* Add Button */}
            <button className="h-10 px-4 rounded-xl gold-gradient text-white text-sm font-medium shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:-translate-y-0.5">
              + Neuer Kunde
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* KPI Section */}
          <div>
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
              <KPICard
                label="Aktive Fälle"
                value={kpis.aktiveFaelle}
                subtext="In Bearbeitung"
              />
              <KPICard
                label="Kritische Fälle"
                value={kpis.kritischeFaelle}
                variant={kpis.kritischeFaelle > 0 ? "highlight" : "default"}
                subtext="Sofort handeln"
              />
              <KPICard
                label="Abschlüsse"
                value={kpis.abschluesse}
                subtext="Diesen Monat"
                trend="up"
              />
            </div>
          </div>

          {/* Secondary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              label="Warnungen"
              value={kpis.warnungen}
              subtext="Berater prüfen"
            />
            <KPICard
              label="Neue Leads"
              value={kpis.neueLeads}
              subtext="Erstkontakt"
            />
            <KPICard
              label="Stau-Fälle"
              value={kpis.stauFaelle}
              subtext="> 3 Tage keine Aktivität"
            />
            <KPICard
              label="Durchlaufzeit"
              value={`${kpis.durchlaufzeit}d`}
              subtext="Phase 1-3 Ø"
            />
          </div>

          {/* Critical Cases */}
          {kritischeFaelle.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-red-500 rounded-full" />
                <h2 className="text-lg font-semibold text-gray-900">Kritische Fälle</h2>
              </div>
              <FallListe
                faelle={kritischeFaelle}
                titel={`${kritischeFaelle.length} kritische Fälle`}
                variant="critical"
              />
            </div>
          )}

          {/* Warnings */}
          {warnungsFaelle.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-amber-500 rounded-full" />
                <h2 className="text-lg font-semibold text-gray-900">Warnungen</h2>
              </div>
              <FallListe
                faelle={warnungsFaelle}
                titel={`${warnungsFaelle.length} Fälle mit Warnungen`}
              />
            </div>
          )}

          {/* Pipeline */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 gold-gradient rounded-full" />
                <h2 className="text-lg font-semibold text-gray-900">Pipeline</h2>
              </div>
              <a href="/pipeline" className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
                Alle anzeigen
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            <PipelineKompakt kunden={kunden} />
          </div>
        </div>
      </main>
    </div>
  );
}

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
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="h-14 px-6 flex items-center justify-between border-b bg-white sticky top-0 z-10">
          <h1 className="font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("de-DE", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <KPICard
              label="Pipeline-Wert"
              value={formatEuro(kpis.pipelineWert)}
            />
            <KPICard label="Aktive Fälle" value={kpis.aktiveFaelle} />
            <KPICard
              label="Kritisch"
              value={kpis.kritischeFaelle}
              highlight={kpis.kritischeFaelle > 0}
            />
            <KPICard label="Warnungen" value={kpis.warnungen} />
            <KPICard label="Neue Leads" value={kpis.neueLeads} />
            <KPICard label="Abschlüsse" value={kpis.abschluesse} />
            <KPICard label="Stau-Fälle" value={kpis.stauFaelle} />
            <KPICard
              label="Durchlaufzeit"
              value={`${kpis.durchlaufzeit} Tage`}
              subtext="Phase 1-3"
            />
          </div>

          {/* Kritische Fälle */}
          {kritischeFaelle.length > 0 && (
            <FallListe
              faelle={kritischeFaelle}
              titel={`Kritische Fälle (${kritischeFaelle.length})`}
            />
          )}

          {/* Warnungen */}
          {warnungsFaelle.length > 0 && (
            <FallListe
              faelle={warnungsFaelle}
              titel={`Warnungen (${warnungsFaelle.length})`}
            />
          )}

          {/* Pipeline */}
          <PipelineKompakt kunden={kunden} />
        </div>
      </main>
    </div>
  );
}

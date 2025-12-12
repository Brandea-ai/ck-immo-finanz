import { Sidebar } from "@/components/dashboard/Sidebar";
import { PipelineView } from "@/components/dashboard/PipelineView";
import { KPICards } from "@/components/dashboard/KPICards";
import { demoKunden, getKPIs } from "@/lib/demo-data";
import { Bell, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PipelinePage() {
  const kpis = getKPIs();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6">
          <div>
            <h1 className="text-xl font-semibold">Pipeline</h1>
            <p className="text-sm text-muted-foreground">
              11 Phasen • {demoKunden.length} Kunden
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Kunde suchen..."
                className="h-9 w-64 rounded-lg border bg-slate-50 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button className="relative rounded-lg p-2 hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <Button>
              <Plus className="h-4 w-4" />
              Neuer Kunde
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6">
          <KPICards {...kpis} />

          <div>
            <h2 className="text-lg font-semibold mb-4">
              Alle Phasen
            </h2>
            <PipelineView kunden={demoKunden} />
          </div>
        </div>
      </main>
    </div>
  );
}

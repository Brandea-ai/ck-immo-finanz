"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatusDot } from "@/components/dashboard/StatusDot";
import { DragDropPipeline } from "@/components/pipeline/DragDropPipeline";
import { KundeFormModal } from "@/components/kunde/KundeFormModal";
import { useStore } from "@/lib/store";

function formatEuro(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PipelinePage() {
  const { kunden, getKPIs } = useStore();
  const kpis = getKPIs();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-gray-200 bg-white shrink-0">
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
            <button
              onClick={() => setShowCreateModal(true)}
              className="h-10 px-4 rounded-xl gold-gradient text-white text-sm font-medium shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:-translate-y-0.5"
            >
              + Neuer Kunde
            </button>
          </div>
        </header>

        {/* Drag & Drop Info */}
        <div className="px-6 py-3 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-amber-800">
            <strong>Tipp:</strong> Ziehen Sie Kunden per Drag & Drop zwischen den Phasen. Klicken Sie auf einen Kunden für Details.
          </p>
        </div>

        {/* Pipeline Board */}
        <div className="flex-1 p-6 overflow-x-auto overflow-y-hidden">
          <DragDropPipeline />
        </div>
      </main>

      {/* Create Modal */}
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

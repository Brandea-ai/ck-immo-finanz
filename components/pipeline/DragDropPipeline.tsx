"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Kunde, PHASEN } from "@/types";
import { StatusDot } from "@/components/dashboard/StatusDot";
import { KundeDetailModal } from "@/components/kunde/KundeDetailModal";
import { cn } from "@/lib/utils";

function formatEuro(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

// Sortable Kunde Card
function SortableKundeCard({ kunde, onClick }: { kunde: Kunde; onClick: () => void }) {
  const { getBeraterById } = useStore();
  const berater = getBeraterById(kunde.beraterId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: kunde.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "p-4 rounded-xl border bg-white cursor-grab active:cursor-grabbing transition-all duration-200",
        "hover:shadow-lg hover:border-amber-300 hover:-translate-y-1",
        kunde.status === "red" && "border-red-300 bg-red-50",
        isDragging && "opacity-50 shadow-2xl scale-105"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatusDot status={kunde.status} size="md" pulse={kunde.status === "red"} />
          <span className="font-semibold text-gray-900">{kunde.name}</span>
        </div>
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            kunde.tageInPhase >= 5
              ? "bg-red-100 text-red-700"
              : kunde.tageInPhase >= 3
              ? "bg-amber-100 text-amber-700"
              : "bg-slate-100 text-slate-600"
          )}
        >
          {kunde.tageInPhase}d
        </span>
      </div>
      <p className="text-lg font-semibold text-gray-900 mb-2">
        {formatEuro(kunde.finanzierungsvolumen)}
      </p>
      {kunde.naechsteAktion && (
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{kunde.naechsteAktion}</p>
      )}
      {kunde.fehlendeDokumente.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-red-600 font-medium mb-1">Fehlende Dokumente:</p>
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
          <span className="text-xs text-slate-500">{berater?.name}</span>
        </div>
        <span className="text-xs text-slate-400">{kunde.objectType}</span>
      </div>
    </div>
  );
}

// Kunde Card for Overlay (while dragging)
function KundeCardOverlay({ kunde }: { kunde: Kunde }) {
  const { getBeraterById } = useStore();
  const berater = getBeraterById(kunde.beraterId);

  return (
    <div className="p-4 rounded-xl border-2 border-amber-400 bg-white shadow-2xl w-72">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatusDot status={kunde.status} size="md" />
          <span className="font-semibold text-gray-900">{kunde.name}</span>
        </div>
      </div>
      <p className="text-lg font-semibold text-amber-600">
        {formatEuro(kunde.finanzierungsvolumen)}
      </p>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600">
          {berater?.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <span className="text-xs text-slate-500">{berater?.name}</span>
      </div>
    </div>
  );
}

// Phase Column
function PhaseColumn({
  phase,
  kunden,
  onKundeClick,
}: {
  phase: typeof PHASEN[0];
  kunden: Kunde[];
  onKundeClick: (kunde: Kunde) => void;
}) {
  const volumen = kunden.reduce((s, k) => s + k.finanzierungsvolumen, 0);
  const hasKritisch = kunden.some((k) => k.status === "red");

  return (
    <div
      className={cn(
        "w-72 shrink-0 rounded-xl border flex flex-col h-full",
        hasKritisch ? "bg-red-50/50 border-red-200" : "bg-white border-gray-100"
      )}
    >
      {/* Phase Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-8 rounded-lg gold-gradient text-white text-sm font-bold flex items-center justify-center shadow-md">
            {phase.id}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{phase.name}</h3>
          </div>
        </div>
        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{phase.beschreibung}</p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-sm text-slate-500">
            {kunden.length} {kunden.length === 1 ? "Fall" : "Fälle"}
          </span>
          <span className="text-sm font-semibold text-gray-900">{formatEuro(volumen)}</span>
        </div>
      </div>

      {/* Kunden */}
      <SortableContext items={kunden.map((k) => k.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 p-3 space-y-2 overflow-y-auto min-h-[200px]">
          {kunden.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-sm">Hierher ziehen</p>
            </div>
          ) : (
            kunden.map((kunde) => (
              <SortableKundeCard
                key={kunde.id}
                kunde={kunde}
                onClick={() => onKundeClick(kunde)}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}

// Main Pipeline Component
export function DragDropPipeline() {
  const { kunden, moveKundeToPhase, getKPIs } = useStore();
  const [activeKunde, setActiveKunde] = useState<Kunde | null>(null);
  const [selectedKunde, setSelectedKunde] = useState<Kunde | null>(null);
  const kpis = getKPIs();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const kunde = kunden.find((k) => k.id === event.active.id);
    if (kunde) setActiveKunde(kunde);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveKunde(null);

    if (!over) return;

    // Find which phase the item was dropped over
    const overId = over.id as string;

    // Check if dropped over a phase column
    const targetPhase = PHASEN.find((p) => `phase-${p.id}` === overId);
    if (targetPhase) {
      moveKundeToPhase(active.id as string, targetPhase.id);
      return;
    }

    // Check if dropped over another kunde (to determine which phase)
    const targetKunde = kunden.find((k) => k.id === overId);
    if (targetKunde && targetKunde.id !== active.id) {
      moveKundeToPhase(active.id as string, targetKunde.phase);
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 min-w-max h-full pb-4">
          {PHASEN.map((phase) => {
            const phasenKunden = kunden.filter((k) => k.phase === phase.id);
            return (
              <div key={phase.id} id={`phase-${phase.id}`}>
                <PhaseColumn
                  phase={phase}
                  kunden={phasenKunden}
                  onKundeClick={(kunde) => setSelectedKunde(kunde)}
                />
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeKunde ? <KundeCardOverlay kunde={activeKunde} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Kunde Detail Modal */}
      {selectedKunde && (
        <KundeDetailModal
          kunde={selectedKunde}
          isOpen={!!selectedKunde}
          onClose={() => setSelectedKunde(null)}
        />
      )}
    </>
  );
}

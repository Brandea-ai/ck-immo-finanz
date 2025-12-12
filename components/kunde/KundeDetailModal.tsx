"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { StatusDot } from "@/components/dashboard/StatusDot";
import { useStore } from "@/lib/store";
import { Kunde, PHASEN, Status } from "@/types";
import { cn } from "@/lib/utils";

interface KundeDetailModalProps {
  kunde: Kunde;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "overview" | "documents" | "activities" | "notes";

function formatEuro(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function KundeDetailModal({ kunde, isOpen, onClose }: KundeDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const {
    getBeraterById,
    updateKundeStatus,
    moveKundeToPhase,
    addActivity,
    recalculateKundeStatus,
    getKundeRedFlags,
    getKundeRequiredDocs,
    getKundePhaseRequirements,
    getKundeRecommendedAction,
  } = useStore();
  const [newNote, setNewNote] = useState("");

  const berater = getBeraterById(kunde.beraterId);
  const phase = PHASEN.find((p) => p.id === kunde.phase);

  // Intelligent business logic
  const redFlags = getKundeRedFlags(kunde.id);
  const requiredDocs = getKundeRequiredDocs(kunde.id);
  const phaseRequirements = getKundePhaseRequirements(kunde.id);
  const recommendedAction = getKundeRecommendedAction(kunde.id);

  const handleStatusChange = (status: Status) => {
    updateKundeStatus(kunde.id, status);
  };

  const handlePhaseChange = (newPhase: number) => {
    moveKundeToPhase(kunde.id, newPhase);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addActivity(kunde.id, {
      id: `note-${Date.now()}`,
      type: "note",
      content: newNote,
      createdAt: new Date().toISOString(),
      createdBy: berater?.name || "System",
    });
    setNewNote("");
  };

  const tabs = [
    { id: "overview" as TabType, label: "Übersicht", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { id: "documents" as TabType, label: "Dokumente", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { id: "activities" as TabType, label: "Aktivitäten", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "notes" as TabType, label: "Notizen", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title={kunde.name}>
      <div className="flex flex-col h-full">
        {/* Status Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <StatusDot status={kunde.status} size="md" pulse={kunde.status === "red"} />
              <span className="text-sm font-medium text-gray-700">
                {kunde.status === "green" ? "OK" : kunde.status === "yellow" ? "Warnung" : "Kritisch"}
              </span>
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg gold-gradient text-white text-xs font-bold flex items-center justify-center">
                {kunde.phase}
              </span>
              <span className="text-sm text-gray-600">{phase?.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{kunde.tageInPhase} Tage in Phase</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-100">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-3 text-sm font-medium transition-all relative",
                  activeTab === tab.id
                    ? "text-amber-600"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  {tab.label}
                </div>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 gold-gradient"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-2 gap-6">
              {/* Kundendaten */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-4 gold-gradient rounded-full" />
                  Kundendaten
                </h3>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <InfoRow label="E-Mail" value={kunde.email} />
                  <InfoRow label="Telefon" value={kunde.phone} />
                  {kunde.address && <InfoRow label="Adresse" value={kunde.address} />}
                  <InfoRow label="Beschäftigung" value={kunde.customerType === "angestellt" ? "Angestellt" : kunde.customerType === "selbststaendig" ? "Selbstständig" : "Verbeamtet"} />
                  {kunde.arbeitgeber && <InfoRow label="Arbeitgeber" value={kunde.arbeitgeber} />}
                  {kunde.nettoEinkommen && <InfoRow label="Netto-Einkommen" value={formatEuro(kunde.nettoEinkommen)} />}
                </div>
              </div>

              {/* Finanzierung */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-4 gold-gradient rounded-full" />
                  Finanzierung
                </h3>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <InfoRow label="Volumen" value={formatEuro(kunde.finanzierungsvolumen)} highlight />
                  {kunde.kaufpreis && <InfoRow label="Kaufpreis" value={formatEuro(kunde.kaufpreis)} />}
                  {kunde.eigenkapital && <InfoRow label="Eigenkapital" value={formatEuro(kunde.eigenkapital)} />}
                </div>
              </div>

              {/* Objekt */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-4 gold-gradient rounded-full" />
                  Objekt
                </h3>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <InfoRow label="Typ" value={kunde.objectType} />
                  <InfoRow label="Nutzung" value={kunde.usageType === "eigennutzer" ? "Eigennutzung" : "Kapitalanlage"} />
                  {kunde.objectAddress && <InfoRow label="Adresse" value={kunde.objectAddress} />}
                  {kunde.wohnflaeche && <InfoRow label="Wohnfläche" value={`${kunde.wohnflaeche} m²`} />}
                </div>
              </div>

              {/* Berater */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-4 gold-gradient rounded-full" />
                  Berater
                </h3>
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600">
                      {berater?.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{berater?.name}</p>
                      <p className="text-sm text-slate-500">{berater?.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Red Flags - Intelligent Detection */}
              {redFlags.length > 0 && (
                <div className="col-span-2 space-y-4">
                  <h3 className="font-semibold text-red-600 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Red Flags ({redFlags.length})
                  </h3>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <ul className="space-y-3">
                      {redFlags.map((flag) => (
                        <li key={flag.id} className="flex items-start gap-3">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-xs font-medium shrink-0",
                            flag.severity === "critical" ? "bg-red-200 text-red-800" : "bg-amber-200 text-amber-800"
                          )}>
                            {flag.severity === "critical" ? "Kritisch" : "Warnung"}
                          </span>
                          <div>
                            <p className="text-sm text-red-700">{flag.message}</p>
                            <p className="text-xs text-red-500 mt-0.5">{flag.category}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Phase Requirements & Blockers */}
              {phaseRequirements && (
                <div className="col-span-2 space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-1 h-4 gold-gradient rounded-full" />
                    Phase {kunde.phase} Status
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Blockers */}
                    {phaseRequirements.blockers.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m5-10a5 5 0 00-10 0v4h10V7z" />
                          </svg>
                          Blockierend
                        </h4>
                        <ul className="space-y-1">
                          {phaseRequirements.blockers.map((blocker, i) => (
                            <li key={i} className="text-sm text-red-700 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              {blocker}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Next Actions */}
                    <div className={cn(
                      "bg-slate-50 rounded-xl p-4",
                      phaseRequirements.blockers.length === 0 && "md:col-span-2"
                    )}>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        Mögliche Aktionen
                      </h4>
                      <ul className="space-y-1">
                        {phaseRequirements.nextActions.map((action, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Empfohlene Nächste Aktion */}
              <div className="col-span-2 space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-4 gold-gradient rounded-full" />
                  Empfohlene Aktion
                </h3>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-amber-800">{recommendedAction || kunde.naechsteAktion}</p>
                    {phaseRequirements?.canAdvance && (
                      <p className="text-xs text-amber-600 mt-1">Bereit für nächste Phase</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-6">
              {/* Fehlende Dokumente */}
              {kunde.fehlendeDokumente.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-600 flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Fehlende Dokumente ({kunde.fehlendeDokumente.length})
                  </h3>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <ul className="space-y-2">
                      {kunde.fehlendeDokumente.map((doc, i) => (
                        <li key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-red-700">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            {doc}
                          </div>
                          <button className="text-xs px-2 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors">
                            Anfordern
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Vollständige Unterlagenliste */}
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 gold-gradient rounded-full" />
                  Erforderliche Unterlagen ({requiredDocs.length})
                </h3>
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="grid gap-2">
                    {requiredDocs.map((doc, i) => {
                      const isMissing = kunde.fehlendeDokumente.some(
                        (d) => doc.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(doc.toLowerCase())
                      );
                      return (
                        <div
                          key={i}
                          className={cn(
                            "flex items-center gap-3 p-2 rounded-lg text-sm",
                            isMissing ? "bg-red-50 text-red-700" : "text-gray-700"
                          )}
                        >
                          {isMissing ? (
                            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          <span>{doc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Fortschritt */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Dokumenten-Fortschritt</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {requiredDocs.length - kunde.fehlendeDokumente.length} / {requiredDocs.length}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full gold-gradient rounded-full transition-all"
                    style={{
                      width: `${((requiredDocs.length - kunde.fehlendeDokumente.length) / requiredDocs.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "activities" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-4 gold-gradient rounded-full" />
                Aktivitäten-Verlauf
              </h3>
              <div className="space-y-3">
                {kunde.activities.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Keine Aktivitäten vorhanden</p>
                ) : (
                  [...kunde.activities].reverse().map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 p-3 bg-slate-50 rounded-xl"
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        activity.type === "call" && "bg-blue-100 text-blue-600",
                        activity.type === "email" && "bg-purple-100 text-purple-600",
                        activity.type === "whatsapp" && "bg-green-100 text-green-600",
                        activity.type === "document" && "bg-amber-100 text-amber-600",
                        activity.type === "note" && "bg-slate-200 text-slate-600",
                        activity.type === "status_change" && "bg-red-100 text-red-600",
                        activity.type === "phase_change" && "bg-emerald-100 text-emerald-600",
                      )}>
                        <ActivityIcon type={activity.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.content}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {activity.createdBy} · {formatDate(activity.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-4 gold-gradient rounded-full" />
                Notiz hinzufügen
              </h3>
              <div className="flex gap-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Neue Notiz eingeben..."
                  className="flex-1 p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  rows={3}
                />
              </div>
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="px-4 py-2 rounded-xl gold-gradient text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                Notiz speichern
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Status:</span>
            {(["green", "yellow", "red"] as Status[]).map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                  kunde.status === s ? "ring-2 ring-offset-2" : "opacity-50 hover:opacity-100",
                  s === "green" && "bg-emerald-500 ring-emerald-500",
                  s === "yellow" && "bg-amber-500 ring-amber-500",
                  s === "red" && "bg-red-500 ring-red-500",
                )}
              >
                <StatusDot status={s} size="sm" />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={kunde.phase}
              onChange={(e) => handlePhaseChange(Number(e.target.value))}
              className="h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              {PHASEN.map((p) => (
                <option key={p.id} value={p.id}>
                  Phase {p.id}: {p.name}
                </option>
              ))}
            </select>
            <button
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-gray-200 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={cn("text-sm", highlight ? "font-semibold text-amber-600" : "text-gray-900")}>
        {value}
      </span>
    </div>
  );
}

function ActivityIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    call: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    email: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    whatsapp: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    document: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    note: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    status_change: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    phase_change: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  };

  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[type] || icons.note} />
    </svg>
  );
}

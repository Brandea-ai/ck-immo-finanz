"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatusDot } from "@/components/dashboard/StatusDot";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function formatEuro(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    GF: "Geschäftsführer",
    BERATER: "Berater",
    AZUBI: "Auszubildender",
    AUSHILFE: "Aushilfe",
  };
  return labels[role] || role;
}

function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    GF: "gold-gradient text-white",
    BERATER: "bg-blue-500 text-white",
    AZUBI: "bg-emerald-500 text-white",
    AUSHILFE: "bg-slate-500 text-white",
  };
  return colors[role] || "bg-slate-500 text-white";
}

export default function TeamPage() {
  const { team, kunden } = useStore();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
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
            <h1 className="text-2xl font-semibold text-gray-900">Team</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {team.length} Mitarbeiter · {kunden.length} aktive Fälle
            </p>
          </div>
        </header>

        {/* Team Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-8"
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {team.map((mitarbeiter) => {
              const faelle = kunden.filter((k) => k.beraterId === mitarbeiter.id);
              const volumen = faelle.reduce((s, k) => s + k.finanzierungsvolumen, 0);
              const kritisch = faelle.filter((k) => k.status === "red").length;
              const warnungen = faelle.filter((k) => k.status === "yellow").length;
              const isExpanded = selectedMember === mitarbeiter.id;

              return (
                <motion.div
                  key={mitarbeiter.id}
                  variants={cardVariants}
                  layoutId={mitarbeiter.id}
                  onClick={() => setSelectedMember(isExpanded ? null : mitarbeiter.id)}
                  className={cn(
                    "bg-white rounded-xl border shadow-sm overflow-hidden cursor-pointer transition-all duration-300",
                    isExpanded
                      ? "border-amber-300 shadow-lg"
                      : "border-gray-100 hover:shadow-lg hover:-translate-y-1"
                  )}
                >
                  {/* Header with gradient */}
                  <div className="h-16 bg-gradient-to-br from-slate-800 to-slate-900 relative">
                    <div className="absolute -bottom-8 left-4">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg",
                          getRoleColor(mitarbeiter.role)
                        )}
                      >
                        {mitarbeiter.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-10 p-4">
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 text-lg">{mitarbeiter.name}</h3>
                      <p className="text-sm text-amber-600 font-medium">
                        {getRoleLabel(mitarbeiter.role)}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 py-4 border-y border-gray-100">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{faelle.length}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Fälle</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-amber-600">
                          {(volumen / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Volumen</p>
                      </div>
                      <div className="text-center">
                        <p
                          className={cn(
                            "text-2xl font-bold",
                            kritisch > 0 ? "text-red-600" : "text-gray-900"
                          )}
                        >
                          {kritisch}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Kritisch</p>
                      </div>
                    </div>

                    {/* Status indicators */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-1.5">
                        <StatusDot status="green" size="sm" />
                        <span className="text-xs text-slate-500">
                          {faelle.filter((f) => f.status === "green").length}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <StatusDot status="yellow" size="sm" />
                        <span className="text-xs text-slate-500">{warnungen}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <StatusDot status="red" size="sm" />
                        <span className="text-xs text-slate-500">{kritisch}</span>
                      </div>
                    </div>

                    {/* Contact - expanded */}
                    <motion.div
                      initial={false}
                      animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          {mitarbeiter.email}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {mitarbeiter.phone}
                        </p>

                        {/* Cases list */}
                        {faelle.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs font-medium text-slate-600 mb-2">Aktive Fälle:</p>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {faelle.slice(0, 5).map((fall) => (
                                <div
                                  key={fall.id}
                                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50"
                                >
                                  <div className="flex items-center gap-2">
                                    <StatusDot status={fall.status} size="sm" />
                                    <span className="text-gray-700">{fall.name}</span>
                                  </div>
                                  <span className="text-slate-500">
                                    {formatEuro(fall.finanzierungsvolumen)}
                                  </span>
                                </div>
                              ))}
                              {faelle.length > 5 && (
                                <p className="text-xs text-slate-400 text-center py-1">
                                  +{faelle.length - 5} weitere
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Expand indicator */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
                      <motion.svg
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </motion.svg>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

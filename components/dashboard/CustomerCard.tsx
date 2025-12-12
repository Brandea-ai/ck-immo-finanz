"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { Kunde, PHASES } from "@/types";
import {
  Phone,
  Mail,
  MessageCircle,
  Clock,
  FileText,
  ChevronRight,
} from "lucide-react";

interface CustomerCardProps {
  kunde: Kunde;
}

export function CustomerCard({ kunde }: CustomerCardProps) {
  const phase = PHASES.find((p) => p.id === kunde.phase);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{kunde.name}</h3>
            <p className="text-sm text-muted-foreground">{kunde.phone}</p>
          </div>
          <StatusBadge status={kunde.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Phase */}
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${phase?.color || "bg-gray-400"}`}
          />
          <span className="text-sm font-medium">
            Phase {kunde.phase}: {phase?.name}
          </span>
        </div>

        {/* Finanzierungsvolumen */}
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-muted-foreground">Finanzierungsvolumen</p>
          <p className="text-xl font-bold text-blue-600">
            {formatCurrency(kunde.financingVolume)}
          </p>
        </div>

        {/* Status Text */}
        {kunde.statusText && (
          <p className="text-sm text-muted-foreground border-l-2 border-yellow-400 pl-2">
            {kunde.statusText}
          </p>
        )}

        {/* Next Action */}
        {kunde.nextAction && (
          <div className="flex items-center gap-2 text-sm">
            <ChevronRight className="h-4 w-4 text-blue-600" />
            <span>{kunde.nextAction}</span>
          </div>
        )}

        {/* Missing Docs */}
        {kunde.missingDocs.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-red-600 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Fehlende Unterlagen:
            </p>
            <ul className="text-xs text-muted-foreground space-y-0.5">
              {kunde.missingDocs.slice(0, 2).map((doc) => (
                <li key={doc}>• {doc}</li>
              ))}
              {kunde.missingDocs.length > 2 && (
                <li className="text-blue-600">
                  +{kunde.missingDocs.length - 2} weitere
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {kunde.daysInPhase} Tage in Phase
          </span>
          {kunde.deadlineDays !== undefined && (
            <span
              className={
                kunde.deadlineDays <= 2 ? "text-red-600 font-medium" : ""
              }
            >
              Deadline: {kunde.deadlineDays} Tage
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Phone className="h-4 w-4" />
            Anrufen
          </Button>
          <Button size="sm" variant="ghost" className="px-2">
            <Mail className="h-4 w-4" />
          </Button>
        </div>

        {/* Berater */}
        {kunde.berater && (
          <div className="flex items-center gap-2 pt-2 border-t text-xs text-muted-foreground">
            <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium">
              {kunde.berater.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <span>{kunde.berater.name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, MessageCircle, Mail, FileText, Bell, Clock } from "lucide-react";

const demoLogs = [
  {
    id: 1,
    action: "WhatsApp gesendet",
    description: "Willkommensnachricht an Sandra Braun",
    icon: MessageCircle,
    color: "text-green-600 bg-green-50",
    time: "vor 2 Min.",
  },
  {
    id: 2,
    action: "Dokument klassifiziert",
    description: "Gehaltsnachweis von Thomas Müller erkannt",
    icon: FileText,
    color: "text-blue-600 bg-blue-50",
    time: "vor 15 Min.",
  },
  {
    id: 3,
    action: "Erinnerung gesendet",
    description: "Unterlagen-Reminder an Anna Schmidt",
    icon: Bell,
    color: "text-yellow-600 bg-yellow-50",
    time: "vor 1 Std.",
  },
  {
    id: 4,
    action: "Phase gewechselt",
    description: "Stefan Hoffmann: Phase 8 → Phase 9",
    icon: Zap,
    color: "text-purple-600 bg-purple-50",
    time: "vor 2 Std.",
  },
  {
    id: 5,
    action: "E-Mail gesendet",
    description: "Finanzierungskonzept an Julia Becker",
    icon: Mail,
    color: "text-cyan-600 bg-cyan-50",
    time: "vor 3 Std.",
  },
];

export function AutomationLog() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-5 w-5 text-yellow-500" />
          Automatisierungs-Log (Heute)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {demoLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 text-sm"
            >
              <div className={`rounded-lg p-1.5 ${log.color}`}>
                <log.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{log.action}</p>
                <p className="text-muted-foreground truncate">
                  {log.description}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {log.time}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Berater } from "@/types";
import { Users } from "lucide-react";

interface TeamSidebarProps {
  berater: Berater[];
}

export function TeamSidebar({ berater }: TeamSidebarProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-5 w-5" />
          Team
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {berater.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                {b.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{b.name}</p>
                <p className="text-xs text-muted-foreground">
                  {b.role === "GF"
                    ? "Geschäftsführer"
                    : b.role === "BERATER"
                    ? "Berater"
                    : b.role}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  {b.kundenCount}
                </p>
                <p className="text-[10px] text-muted-foreground">Kunden</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

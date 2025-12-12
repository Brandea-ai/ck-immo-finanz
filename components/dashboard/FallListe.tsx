import { Kunde, PHASEN } from "@/types";
import { StatusDot } from "./StatusDot";
import { getBeraterById } from "@/lib/demo-data";

interface FallListeProps {
  faelle: Kunde[];
  titel?: string;
}

function formatEuro(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function FallListe({ faelle, titel }: FallListeProps) {
  if (faelle.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border">
      {titel && (
        <div className="px-4 py-3 border-b">
          <h3 className="font-medium text-sm">{titel}</h3>
        </div>
      )}
      <div className="divide-y">
        {faelle.map((fall) => {
          const phase = PHASEN.find((p) => p.id === fall.phase);
          const berater = getBeraterById(fall.beraterId);

          return (
            <div
              key={fall.id}
              className="px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <StatusDot status={fall.status} />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{fall.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      Phase {fall.phase}: {phase?.name}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-medium text-sm">
                    {formatEuro(fall.finanzierungsvolumen)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {berater?.name}
                  </p>
                </div>
              </div>
              {fall.naechsteAktion && (
                <p className="text-xs text-muted-foreground mt-2 pl-5">
                  {fall.naechsteAktion}
                </p>
              )}
              {fall.fehlendeDokumente.length > 0 && (
                <div className="mt-2 pl-5">
                  <p className="text-xs text-red-600">
                    Fehlend: {fall.fehlendeDokumente.join(", ")}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatusDot } from "@/components/dashboard/StatusDot";
import { kunden, getBeraterById } from "@/lib/demo-data";
import { PHASEN } from "@/types";

function formatEuro(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function KundenPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="h-14 px-6 flex items-center justify-between border-b bg-white sticky top-0 z-10">
          <div>
            <h1 className="font-semibold">Kunden</h1>
            <p className="text-xs text-muted-foreground">
              {kunden.length} aktive Fälle
            </p>
          </div>
        </header>

        {/* Table */}
        <div className="p-6">
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Phase</th>
                  <th className="text-left px-4 py-3 font-medium">Volumen</th>
                  <th className="text-left px-4 py-3 font-medium">Objekttyp</th>
                  <th className="text-left px-4 py-3 font-medium">Berater</th>
                  <th className="text-left px-4 py-3 font-medium">Tage</th>
                  <th className="text-left px-4 py-3 font-medium">
                    Nächste Aktion
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {kunden.map((kunde) => {
                  const phase = PHASEN.find((p) => p.id === kunde.phase);
                  const berater = getBeraterById(kunde.beraterId);

                  return (
                    <tr
                      key={kunde.id}
                      className="hover:bg-muted/30 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <StatusDot status={kunde.status} />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{kunde.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {kunde.phone}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs">
                          <span className="font-medium">{kunde.phase}.</span>{" "}
                          {phase?.name}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {formatEuro(kunde.finanzierungsvolumen)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {kunde.objectType}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {berater?.name}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            kunde.tageInPhase >= 5
                              ? "text-red-600 font-medium"
                              : kunde.tageInPhase >= 3
                              ? "text-amber-600"
                              : "text-muted-foreground"
                          }
                        >
                          {kunde.tageInPhase}d
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {kunde.naechsteAktion}
                        </p>
                        {kunde.fehlendeDokumente.length > 0 && (
                          <p className="text-xs text-red-600">
                            {kunde.fehlendeDokumente.length} Dok. fehlen
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

import { Sidebar } from "@/components/dashboard/Sidebar";
import { team, kunden } from "@/lib/demo-data";

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

export default function TeamPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="h-14 px-6 flex items-center justify-between border-b bg-white sticky top-0 z-10">
          <div>
            <h1 className="font-semibold">Team</h1>
            <p className="text-xs text-muted-foreground">
              {team.length} Mitarbeiter
            </p>
          </div>
        </header>

        {/* Team Grid */}
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {team.map((mitarbeiter) => {
              const faelle = kunden.filter(
                (k) => k.beraterId === mitarbeiter.id
              );
              const volumen = faelle.reduce(
                (s, k) => s + k.finanzierungsvolumen,
                0
              );
              const kritisch = faelle.filter((k) => k.status === "red").length;

              return (
                <div
                  key={mitarbeiter.id}
                  className="bg-white rounded-lg border p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {mitarbeiter.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{mitarbeiter.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getRoleLabel(mitarbeiter.role)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-semibold">{faelle.length}</p>
                      <p className="text-[10px] text-muted-foreground">Fälle</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">
                        {formatEuro(volumen).replace("€", "")}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Volumen
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-lg font-semibold ${
                          kritisch > 0 ? "text-red-600" : ""
                        }`}
                      >
                        {kritisch}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Kritisch
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t space-y-1">
                    <p className="text-xs text-muted-foreground truncate">
                      {mitarbeiter.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {mitarbeiter.phone}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

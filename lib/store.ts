import { create } from "zustand";
import { Kunde, Berater, KPIs, Status, Activity } from "@/types";

// Demo Team
const team: Berater[] = [
  { id: "gf", name: "Christian Keller", email: "keller@ck-immo.de", phone: "+49 123 456789", role: "GF" },
  { id: "b1", name: "Sarah Weber", email: "weber@ck-immo.de", phone: "+49 123 456780", role: "BERATER" },
  { id: "b2", name: "Thomas Schmidt", email: "schmidt@ck-immo.de", phone: "+49 123 456781", role: "BERATER" },
  { id: "b3", name: "Lisa Müller", email: "mueller@ck-immo.de", phone: "+49 123 456782", role: "BERATER" },
  { id: "b4", name: "Markus Wagner", email: "wagner@ck-immo.de", phone: "+49 123 456783", role: "BERATER" },
  { id: "az", name: "Eray", email: "eray@ck-immo.de", phone: "+49 123 456784", role: "AZUBI" },
  { id: "ah", name: "Oguzhan", email: "oguzhan@ck-immo.de", phone: "+49 123 456785", role: "AUSHILFE" },
];

// Demo Kunden mit erweiterten Daten
const initialKunden: Kunde[] = [
  {
    id: "k1",
    name: "Michael Weber",
    email: "m.weber@email.de",
    phone: "+49 171 1234567",
    address: "Musterstraße 1, 60311 Frankfurt",
    finanzierungsvolumen: 890000,
    eigenkapital: 150000,
    kaufpreis: 920000,
    objectType: "ETW",
    objectAddress: "Parkstraße 15, 60322 Frankfurt",
    usageType: "eigennutzer",
    wohnflaeche: 120,
    customerType: "angestellt",
    nettoEinkommen: 6500,
    arbeitgeber: "Deutsche Bank AG",
    phase: 3,
    status: "red",
    beraterId: "b1",
    tageInPhase: 7,
    naechsteAktion: "Fehlende Gehaltsnachweise anfordern",
    fehlendeDokumente: ["Gehaltsnachweis Dezember", "Kontoauszug"],
    activities: [
      { id: "a1", type: "call", content: "Erstgespräch geführt - Kunde sehr interessiert", createdAt: "2024-12-01", createdBy: "b1" },
      { id: "a2", type: "email", content: "Unterlagenliste versendet", createdAt: "2024-12-02", createdBy: "b1" },
      { id: "a3", type: "document", content: "Personalausweis erhalten", createdAt: "2024-12-05", createdBy: "b1" },
    ],
    redFlags: ["Gehaltsnachweise fehlen > 5 Tage"],
    createdAt: "2024-12-01",
    updatedAt: "2024-12-10",
  },
  {
    id: "k2",
    name: "Anna Schneider",
    email: "a.schneider@email.de",
    phone: "+49 172 2345678",
    finanzierungsvolumen: 650000,
    eigenkapital: 100000,
    kaufpreis: 680000,
    objectType: "EFH",
    objectAddress: "Waldweg 8, 65189 Wiesbaden",
    usageType: "eigennutzer",
    wohnflaeche: 145,
    customerType: "angestellt",
    nettoEinkommen: 5200,
    arbeitgeber: "Lufthansa AG",
    phase: 5,
    status: "green",
    beraterId: "b2",
    tageInPhase: 2,
    naechsteAktion: "Finanzierungsangebote erstellen",
    fehlendeDokumente: [],
    activities: [
      { id: "a4", type: "call", content: "Bedarfsklärung abgeschlossen", createdAt: "2024-12-08", createdBy: "b2" },
      { id: "a5", type: "document", content: "Alle Unterlagen vollständig", createdAt: "2024-12-10", createdBy: "b2" },
    ],
    redFlags: [],
    createdAt: "2024-12-05",
    updatedAt: "2024-12-10",
  },
  {
    id: "k3",
    name: "Peter Hoffmann",
    email: "p.hoffmann@email.de",
    phone: "+49 173 3456789",
    finanzierungsvolumen: 1200000,
    eigenkapital: 300000,
    kaufpreis: 1350000,
    objectType: "MFH",
    objectAddress: "Hauptstraße 42, 63065 Offenbach",
    usageType: "kapitalanlage",
    wohnflaeche: 280,
    customerType: "selbststaendig",
    nettoEinkommen: 12000,
    arbeitgeber: "Selbstständig - IT Beratung",
    phase: 6,
    status: "yellow",
    beraterId: "b1",
    tageInPhase: 4,
    naechsteAktion: "Angebotsbesprechung terminieren",
    fehlendeDokumente: ["BWA aktuell"],
    activities: [
      { id: "a6", type: "call", content: "Angebote vorgestellt", createdAt: "2024-12-09", createdBy: "b1" },
    ],
    redFlags: ["BWA älter als 3 Monate"],
    createdAt: "2024-11-20",
    updatedAt: "2024-12-09",
  },
  {
    id: "k4",
    name: "Nicole Zimmermann",
    email: "n.zimmermann@email.de",
    phone: "+49 174 4567890",
    finanzierungsvolumen: 950000,
    eigenkapital: 200000,
    kaufpreis: 980000,
    objectType: "DHH",
    objectAddress: "Am Park 3, 61476 Kronberg",
    usageType: "eigennutzer",
    wohnflaeche: 165,
    customerType: "verbeamtet",
    nettoEinkommen: 5800,
    arbeitgeber: "Land Hessen",
    phase: 8,
    status: "red",
    beraterId: "b3",
    tageInPhase: 6,
    naechsteAktion: "Rückfragen der Bank klären",
    fehlendeDokumente: ["Ernennungsurkunde"],
    activities: [
      { id: "a7", type: "email", content: "Bank hat Rückfragen zu Ernennungsurkunde", createdAt: "2024-12-08", createdBy: "b3" },
    ],
    redFlags: ["Bank-Rückfrage offen > 3 Tage"],
    createdAt: "2024-11-15",
    updatedAt: "2024-12-08",
  },
  {
    id: "k5",
    name: "Stefan Bauer",
    email: "s.bauer@email.de",
    phone: "+49 175 5678901",
    finanzierungsvolumen: 520000,
    eigenkapital: 80000,
    kaufpreis: 540000,
    objectType: "ETW",
    objectAddress: "Goethestraße 22, 65185 Wiesbaden",
    usageType: "kapitalanlage",
    wohnflaeche: 75,
    customerType: "angestellt",
    nettoEinkommen: 4200,
    arbeitgeber: "Commerzbank AG",
    phase: 2,
    status: "green",
    beraterId: "b4",
    tageInPhase: 1,
    naechsteAktion: "Erstgespräch durchführen",
    fehlendeDokumente: [],
    activities: [
      { id: "a8", type: "note", content: "Lead über Empfehlung eingegangen", createdAt: "2024-12-12", createdBy: "b4" },
    ],
    redFlags: [],
    createdAt: "2024-12-12",
    updatedAt: "2024-12-12",
  },
  {
    id: "k6",
    name: "Julia Krause",
    email: "j.krause@email.de",
    phone: "+49 176 6789012",
    finanzierungsvolumen: 780000,
    eigenkapital: 180000,
    kaufpreis: 820000,
    objectType: "EFH",
    objectAddress: "Bergstraße 11, 61440 Oberursel",
    usageType: "eigennutzer",
    wohnflaeche: 155,
    customerType: "angestellt",
    nettoEinkommen: 7500,
    arbeitgeber: "SAP SE",
    phase: 4,
    status: "yellow",
    beraterId: "b2",
    tageInPhase: 3,
    naechsteAktion: "Selbstauskunft zur Unterschrift senden",
    fehlendeDokumente: [],
    activities: [
      { id: "a9", type: "document", content: "Selbstauskunft erstellt", createdAt: "2024-12-10", createdBy: "b2" },
    ],
    redFlags: [],
    createdAt: "2024-12-03",
    updatedAt: "2024-12-10",
  },
  {
    id: "k7",
    name: "Martin Fischer",
    email: "m.fischer@email.de",
    phone: "+49 177 7890123",
    finanzierungsvolumen: 450000,
    eigenkapital: 90000,
    kaufpreis: 480000,
    objectType: "ETW",
    objectAddress: "Schillerplatz 5, 60313 Frankfurt",
    usageType: "eigennutzer",
    wohnflaeche: 85,
    customerType: "angestellt",
    nettoEinkommen: 3800,
    arbeitgeber: "Fraport AG",
    phase: 9,
    status: "green",
    beraterId: "b3",
    tageInPhase: 2,
    naechsteAktion: "Kreditvertrag prüfen",
    fehlendeDokumente: [],
    activities: [
      { id: "a10", type: "status_change", content: "Kreditzusage erhalten!", createdAt: "2024-12-11", createdBy: "b3" },
    ],
    redFlags: [],
    createdAt: "2024-11-01",
    updatedAt: "2024-12-11",
  },
  {
    id: "k8",
    name: "Sandra Wolf",
    email: "s.wolf@email.de",
    phone: "+49 178 8901234",
    finanzierungsvolumen: 1100000,
    eigenkapital: 250000,
    kaufpreis: 1150000,
    objectType: "MFH",
    objectAddress: "Industriestraße 8, 63450 Hanau",
    usageType: "kapitalanlage",
    wohnflaeche: 240,
    customerType: "selbststaendig",
    nettoEinkommen: 9500,
    arbeitgeber: "Selbstständig - Steuerberatung",
    phase: 7,
    status: "green",
    beraterId: "b4",
    tageInPhase: 3,
    naechsteAktion: "Auf Objektzusage warten",
    fehlendeDokumente: [],
    activities: [
      { id: "a11", type: "call", content: "Notartermin für nächste Woche geplant", createdAt: "2024-12-10", createdBy: "b4" },
    ],
    redFlags: [],
    createdAt: "2024-11-10",
    updatedAt: "2024-12-10",
  },
  {
    id: "k9",
    name: "Klaus Meyer",
    email: "k.meyer@email.de",
    phone: "+49 179 9012345",
    finanzierungsvolumen: 380000,
    eigenkapital: 60000,
    kaufpreis: 400000,
    objectType: "ETW",
    objectAddress: "Lindenstraße 18, 65929 Frankfurt",
    usageType: "eigennutzer",
    wohnflaeche: 68,
    customerType: "angestellt",
    nettoEinkommen: 3200,
    arbeitgeber: "Deutsche Bahn AG",
    phase: 1,
    status: "green",
    beraterId: "b1",
    tageInPhase: 0,
    naechsteAktion: "Erstkontakt aufnehmen",
    fehlendeDokumente: [],
    activities: [
      { id: "a12", type: "note", content: "Anfrage über Website", createdAt: "2024-12-13", createdBy: "gf" },
    ],
    redFlags: [],
    createdAt: "2024-12-13",
    updatedAt: "2024-12-13",
  },
  {
    id: "k10",
    name: "Eva Richter",
    email: "e.richter@email.de",
    phone: "+49 170 0123456",
    finanzierungsvolumen: 720000,
    eigenkapital: 170000,
    kaufpreis: 750000,
    objectType: "DHH",
    objectAddress: "Tannenweg 6, 61352 Bad Homburg",
    usageType: "eigennutzer",
    wohnflaeche: 135,
    customerType: "verbeamtet",
    nettoEinkommen: 5500,
    arbeitgeber: "Bundespolizei",
    phase: 10,
    status: "green",
    beraterId: "gf",
    tageInPhase: 4,
    naechsteAktion: "Auszahlung koordinieren",
    fehlendeDokumente: [],
    activities: [
      { id: "a13", type: "status_change", content: "Notartermin erfolgreich!", createdAt: "2024-12-09", createdBy: "gf" },
    ],
    redFlags: [],
    createdAt: "2024-10-15",
    updatedAt: "2024-12-09",
  },
  {
    id: "k11",
    name: "Frank Schulz",
    email: "f.schulz@email.de",
    phone: "+49 171 1122334",
    finanzierungsvolumen: 560000,
    eigenkapital: 110000,
    kaufpreis: 590000,
    objectType: "EFH",
    objectAddress: "Eichenallee 12, 65719 Hofheim",
    usageType: "eigennutzer",
    wohnflaeche: 125,
    customerType: "angestellt",
    nettoEinkommen: 4800,
    arbeitgeber: "Siemens AG",
    phase: 11,
    status: "green",
    beraterId: "b2",
    tageInPhase: 30,
    naechsteAktion: "Nachbetreuung - Geburtstagsgruß planen",
    fehlendeDokumente: [],
    activities: [
      { id: "a14", type: "note", content: "Abschluss erfolgreich - Kunde sehr zufrieden", createdAt: "2024-11-15", createdBy: "b2" },
    ],
    redFlags: [],
    createdAt: "2024-09-01",
    updatedAt: "2024-11-15",
  },
];

interface AppState {
  // Data
  kunden: Kunde[];
  team: Berater[];
  selectedKunde: Kunde | null;

  // UI State
  isModalOpen: boolean;
  modalType: "view" | "edit" | "create" | "phase" | null;
  searchQuery: string;
  filterStatus: Status | "all";
  filterBerater: string | "all";
  filterPhase: number | "all";

  // Actions - Kunden
  setKunden: (kunden: Kunde[]) => void;
  addKunde: (kunde: Kunde) => void;
  updateKunde: (id: string, updates: Partial<Kunde>) => void;
  deleteKunde: (id: string) => void;
  moveKundeToPhase: (kundeId: string, newPhase: number) => void;
  updateKundeStatus: (kundeId: string, status: Status) => void;
  addActivity: (kundeId: string, activity: Activity) => void;

  // Actions - UI
  setSelectedKunde: (kunde: Kunde | null) => void;
  openModal: (type: "view" | "edit" | "create" | "phase", kunde?: Kunde) => void;
  closeModal: () => void;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: Status | "all") => void;
  setFilterBerater: (beraterId: string | "all") => void;
  setFilterPhase: (phase: number | "all") => void;

  // Computed
  getKPIs: () => KPIs;
  getFilteredKunden: () => Kunde[];
  getBeraterById: (id: string) => Berater | undefined;
  getKundenByPhase: (phase: number) => Kunde[];
  getKundenByBerater: (beraterId: string) => Kunde[];
}

export const useStore = create<AppState>((set, get) => ({
  // Initial State
  kunden: initialKunden,
  team: team,
  selectedKunde: null,
  isModalOpen: false,
  modalType: null,
  searchQuery: "",
  filterStatus: "all",
  filterBerater: "all",
  filterPhase: "all",

  // Kunden Actions
  setKunden: (kunden) => set({ kunden }),

  addKunde: (kunde) => set((state) => ({
    kunden: [...state.kunden, kunde]
  })),

  updateKunde: (id, updates) => set((state) => ({
    kunden: state.kunden.map((k) =>
      k.id === id ? { ...k, ...updates, updatedAt: new Date().toISOString() } : k
    ),
    selectedKunde: state.selectedKunde?.id === id
      ? { ...state.selectedKunde, ...updates }
      : state.selectedKunde
  })),

  deleteKunde: (id) => set((state) => ({
    kunden: state.kunden.filter((k) => k.id !== id),
    selectedKunde: state.selectedKunde?.id === id ? null : state.selectedKunde
  })),

  moveKundeToPhase: (kundeId, newPhase) => set((state) => ({
    kunden: state.kunden.map((k) =>
      k.id === kundeId
        ? {
            ...k,
            phase: newPhase,
            tageInPhase: 0,
            updatedAt: new Date().toISOString(),
            activities: [
              ...k.activities,
              {
                id: `act-${Date.now()}`,
                type: "phase_change" as const,
                content: `Phase geändert zu Phase ${newPhase}`,
                createdAt: new Date().toISOString(),
                createdBy: "system"
              }
            ]
          }
        : k
    )
  })),

  updateKundeStatus: (kundeId, status) => set((state) => ({
    kunden: state.kunden.map((k) =>
      k.id === kundeId
        ? {
            ...k,
            status,
            updatedAt: new Date().toISOString(),
            activities: [
              ...k.activities,
              {
                id: `act-${Date.now()}`,
                type: "status_change" as const,
                content: `Status geändert zu ${status === 'green' ? 'OK' : status === 'yellow' ? 'Warnung' : 'Kritisch'}`,
                createdAt: new Date().toISOString(),
                createdBy: "system"
              }
            ]
          }
        : k
    )
  })),

  addActivity: (kundeId, activity) => set((state) => ({
    kunden: state.kunden.map((k) =>
      k.id === kundeId
        ? { ...k, activities: [...k.activities, activity] }
        : k
    )
  })),

  // UI Actions
  setSelectedKunde: (kunde) => set({ selectedKunde: kunde }),

  openModal: (type, kunde) => set({
    isModalOpen: true,
    modalType: type,
    selectedKunde: kunde || null
  }),

  closeModal: () => set({
    isModalOpen: false,
    modalType: null
  }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterBerater: (beraterId) => set({ filterBerater: beraterId }),
  setFilterPhase: (phase) => set({ filterPhase: phase }),

  // Computed Values
  getKPIs: () => {
    const { kunden } = get();
    const aktiveFaelle = kunden.filter(k => k.phase < 11).length;
    const kritischeFaelle = kunden.filter(k => k.status === "red").length;
    const warnungen = kunden.filter(k => k.status === "yellow").length;
    const abschluesse = kunden.filter(k => k.phase >= 10).length;
    const neueLeads = kunden.filter(k => k.phase === 1).length;
    const stauFaelle = kunden.filter(k => k.tageInPhase >= 3 && k.phase < 11).length;
    const pipelineWert = kunden
      .filter(k => k.phase < 10)
      .reduce((sum, k) => sum + k.finanzierungsvolumen, 0);

    // Durchschnittliche Durchlaufzeit Phase 1-3
    const phase1to3 = kunden.filter(k => k.phase >= 1 && k.phase <= 3);
    const durchlaufzeit = phase1to3.length > 0
      ? Math.round(phase1to3.reduce((sum, k) => sum + k.tageInPhase, 0) / phase1to3.length)
      : 0;

    return {
      pipelineWert,
      aktiveFaelle,
      kritischeFaelle,
      warnungen,
      abschluesse,
      neueLeads,
      stauFaelle,
      durchlaufzeit,
    };
  },

  getFilteredKunden: () => {
    const { kunden, searchQuery, filterStatus, filterBerater, filterPhase } = get();

    return kunden.filter((kunde) => {
      const matchesSearch = searchQuery === "" ||
        kunde.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kunde.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kunde.phone.includes(searchQuery);

      const matchesStatus = filterStatus === "all" || kunde.status === filterStatus;
      const matchesBerater = filterBerater === "all" || kunde.beraterId === filterBerater;
      const matchesPhase = filterPhase === "all" || kunde.phase === filterPhase;

      return matchesSearch && matchesStatus && matchesBerater && matchesPhase;
    });
  },

  getBeraterById: (id) => {
    return get().team.find((b) => b.id === id);
  },

  getKundenByPhase: (phase) => {
    return get().kunden.filter((k) => k.phase === phase);
  },

  getKundenByBerater: (beraterId) => {
    return get().kunden.filter((k) => k.beraterId === beraterId);
  },
}));

// Helper function to generate unique IDs
export function generateId(): string {
  return `k${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

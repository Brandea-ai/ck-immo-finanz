// Status-Ampel nach Anforderungsdokument
export type Status = "green" | "yellow" | "red";

// Rollen im Team
export type Role = "GF" | "BERATER" | "AZUBI" | "AUSHILFE";

// Objekttypen
export type ObjectType = "ETW" | "EFH" | "DHH" | "MFH" | "Grundstück" | "Gewerbe";

// Kundentyp für Unterlagenliste
export type CustomerType = "angestellt" | "selbststaendig" | "verbeamtet";

// Nutzungsart
export type UsageType = "eigennutzer" | "kapitalanlage";

// Dokument-Status
export type DocumentStatus = "vorhanden" | "fehlend" | "pruefung" | "abgelehnt";

// Aktivität/Notiz
export interface Activity {
  id: string;
  type: "note" | "call" | "email" | "whatsapp" | "document" | "status_change" | "phase_change";
  content: string;
  createdAt: string;
  createdBy: string;
}

// Kunde - erweitert nach Anforderungsdokument
export interface Kunde {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;

  // Finanzierung
  finanzierungsvolumen: number;
  eigenkapital?: number;
  kaufpreis?: number;

  // Objekt
  objectType: ObjectType;
  objectAddress?: string;
  usageType: UsageType;
  wohnflaeche?: number;

  // Einkommen
  customerType: CustomerType;
  nettoEinkommen?: number;
  arbeitgeber?: string;

  // Prozess
  phase: number;
  status: Status;
  beraterId: string;
  tageInPhase: number;

  // Tracking
  naechsteAktion: string;
  fehlendeDokumente: string[];
  activities: Activity[];

  // Red Flags nach Modul C
  redFlags: string[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Berater
export interface Berater {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
}

// Phase - 11 Phasen aus Prozess A-Z
export interface Phase {
  id: number;
  name: string;
  beschreibung: string;
  expectedDays: number;
}

// Alle 11 Phasen aus dem Prozess A-Z Dokument
export const PHASEN: Phase[] = [
  {
    id: 1,
    name: "Lead & Erstkontakt",
    beschreibung: "Anfrage über Website, Empfehlung oder Direktkontakt. Zeitnahe telefonische Kontaktaufnahme.",
    expectedDays: 1,
  },
  {
    id: 2,
    name: "Erstgespräch & Bedarfsklärung",
    beschreibung: "Analyse des Finanzierungsvorhabens: Einkommen, Eigenkapital, Objekt, Ziele und Risiken.",
    expectedDays: 2,
  },
  {
    id: 3,
    name: "Unterlagenprüfung & Analyse",
    beschreibung: "Prüfung auf Vollständigkeit und Werthaltigkeit. Analyse der Bonität und des Objekts.",
    expectedDays: 3,
  },
  {
    id: 4,
    name: "Selbstauskunft",
    beschreibung: "Selbstauskunft wird erstellt und dem Kunden zur Prüfung und Unterschrift zugesendet.",
    expectedDays: 2,
  },
  {
    id: 5,
    name: "Finanzierungskonzept",
    beschreibung: "Ausarbeitung der Finanzierungsstruktur über EuroPace. Vergleich passender Angebote.",
    expectedDays: 2,
  },
  {
    id: 6,
    name: "Angebotsbesprechung",
    beschreibung: "Durchsprache der Angebote mit dem Kunden. Anpassungen und Angebotsannahme.",
    expectedDays: 2,
  },
  {
    id: 7,
    name: "Objektzusage & Konditionen",
    beschreibung: "Abwarten der Objektzusage. Aktualisierung der Konditionen bei Notartermin.",
    expectedDays: 5,
  },
  {
    id: 8,
    name: "Antrag & Unterlagen",
    beschreibung: "Finale Überprüfung aller Unterlagen. Einreichung bei der Bank.",
    expectedDays: 3,
  },
  {
    id: 9,
    name: "Kreditzusage & Vertrag",
    beschreibung: "Prüfung der Kreditzusage und Vertragskonditionen. Beratungsprotokoll.",
    expectedDays: 5,
  },
  {
    id: 10,
    name: "Abschluss & Auszahlung",
    beschreibung: "Notarielle Abwicklung. Auszahlung nach Fälligkeitsvoraussetzungen.",
    expectedDays: 10,
  },
  {
    id: 11,
    name: "Nachbetreuung",
    beschreibung: "Aktive Nachbetreuung: Geburtstage, Updates, Anschlussfinanzierung.",
    expectedDays: 0,
  },
];

// KPIs aus Anforderungsdokument
export interface KPIs {
  pipelineWert: number;
  aktiveFaelle: number;
  kritischeFaelle: number;
  warnungen: number;
  abschluesse: number;
  neueLeads: number;
  stauFaelle: number;
  durchlaufzeit: number;
}

// Für Dokumentenlisten je Kundentyp
export const REQUIRED_DOCUMENTS: Record<CustomerType, string[]> = {
  angestellt: [
    "Personalausweis/Reisepass",
    "Gehaltsnachweise (letzte 3 Monate)",
    "Arbeitsvertrag",
    "Kontoauszüge (letzte 3 Monate)",
    "Renteninformation",
    "Nachweis Eigenkapital",
  ],
  selbststaendig: [
    "Personalausweis/Reisepass",
    "BWA (aktuell)",
    "Jahresabschlüsse (letzte 2-3 Jahre)",
    "Einkommensteuerbescheide",
    "Kontoauszüge (letzte 3 Monate)",
    "Krankenversicherungsnachweis",
    "Nachweis Eigenkapital",
  ],
  verbeamtet: [
    "Personalausweis/Reisepass",
    "Bezügemitteilung (letzte 3 Monate)",
    "Ernennungsurkunde",
    "Kontoauszüge (letzte 3 Monate)",
    "Nachweis Eigenkapital",
  ],
};

export const OBJECT_DOCUMENTS: string[] = [
  "Exposé",
  "Grundbuchauszug",
  "Flurkarte",
  "Wohnflächenberechnung",
  "Energieausweis",
  "Teilungserklärung (bei ETW)",
  "Baupläne/Grundrisse",
  "Kaufvertragsentwurf",
];

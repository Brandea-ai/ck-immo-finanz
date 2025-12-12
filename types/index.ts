export type Status = "green" | "yellow" | "red";

export type ObjectType = "NEUBAU" | "BESTAND" | "KAPITALANLAGE" | "EIGENNUTZER" | "GEWERBE";

export type EmploymentType = "ANGESTELLT" | "SELBSTSTAENDIG" | "BEAMTET" | "RENTNER";

export type Role = "GF" | "BERATER" | "AZUBI" | "AUSHILFE";

export interface Berater {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  aktiveFaelle: number;
}

export interface Kunde {
  id: string;
  name: string;
  email: string;
  phone: string;
  objectType: ObjectType;
  employmentType: EmploymentType;
  finanzierungsvolumen: number;
  objektadresse: string;
  phase: number;
  status: Status;
  tageInPhase: number;
  letzterKontakt: string;
  naechsteAktion: string;
  fehlendeDokumente: string[];
  beraterId: string;
  erstelltAm: string;
}

// Die 11 Phasen exakt nach CK IMMO FINANZ Prozess
export interface Phase {
  id: number;
  name: string;
  beschreibung: string;
}

export const PHASEN: Phase[] = [
  {
    id: 1,
    name: "Lead & Erstkontakt",
    beschreibung: "Anfrage eingegangen, Erstkontakt herstellen",
  },
  {
    id: 2,
    name: "Erstgespräch & Bedarfsklärung",
    beschreibung: "Analyse: Einkommen, Eigenkapital, Objekt, Ziele",
  },
  {
    id: 3,
    name: "Unterlagenprüfung & Analyse",
    beschreibung: "Bonität, Objektprüfung, Selbstauskunft erstellen",
  },
  {
    id: 4,
    name: "Selbstauskunft",
    beschreibung: "Kunde prüft und unterschreibt Selbstauskunft",
  },
  {
    id: 5,
    name: "Finanzierungskonzept",
    beschreibung: "Angebotsauswahl über EuroPace",
  },
  {
    id: 6,
    name: "Angebotsannahme",
    beschreibung: "Kunde nimmt Angebot an, vollständige Unterlagen",
  },
  {
    id: 7,
    name: "Objektzusage & Konditionen",
    beschreibung: "Warten auf Notartermin, Konditionen aktualisieren",
  },
  {
    id: 8,
    name: "Antrag & Unterlagen",
    beschreibung: "Einreichung bei Bank, Rückfragen klären",
  },
  {
    id: 9,
    name: "Kreditzusage & Vertrag",
    beschreibung: "Vertragsprüfung, Beratungsprotokoll",
  },
  {
    id: 10,
    name: "Abschluss & Auszahlung",
    beschreibung: "Notartermin, Darlehensauszahlung",
  },
  {
    id: 11,
    name: "Nachbetreuung",
    beschreibung: "Kundenbindung, Anschlussfinanzierung tracken",
  },
];

// Dokumenttypen für Unterlagen-Management
export const DOKUMENT_TYPEN = {
  ANGESTELLT: [
    "Personalausweis",
    "Gehaltsnachweise (3 Monate)",
    "Arbeitsvertrag",
    "Kontoauszüge (3 Monate)",
  ],
  SELBSTSTAENDIG: [
    "Personalausweis",
    "BWA (aktuell)",
    "Jahresabschlüsse (2 Jahre)",
    "Steuerbescheide (2 Jahre)",
    "Krankenversicherungsnachweis",
    "Kontoauszüge (3 Monate)",
  ],
  OBJEKT: [
    "Exposé",
    "Grundbuchauszug",
    "Kaufvertragsentwurf",
    "Teilungserklärung",
    "Energieausweis",
  ],
};

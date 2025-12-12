export type Status = "ok" | "warning" | "critical";

export type ObjectType = "NEUBAU" | "BESTAND" | "KAPITALANLAGE" | "EIGENNUTZER" | "GEWERBE";

export type EmploymentType = "ANGESTELLT" | "SELBSTSTAENDIG" | "BEAMTET" | "RENTNER";

export interface Berater {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "ADMIN" | "GF" | "BERATER" | "AZUBI";
  kundenCount: number;
}

export interface Kunde {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  objectType: ObjectType;
  employmentType: EmploymentType;
  financingVolume: number;
  propertyAddress?: string;
  phase: number;
  status: Status;
  statusText?: string;
  daysInPhase: number;
  lastContactAt: string;
  autoFollowUp: boolean;
  nextAction?: string;
  deadlineDays?: number;
  berater?: Berater;
  missingDocs: string[];
  createdAt: string;
}

export interface Phase {
  id: number;
  name: string;
  description: string;
  color: string;
}

export const PHASES: Phase[] = [
  { id: 1, name: "Lead & Erstkontakt", description: "Anfrage eingegangen", color: "bg-slate-500" },
  { id: 2, name: "Erstgespräch", description: "Telefonat geführt", color: "bg-blue-500" },
  { id: 3, name: "Unterlagenprüfung", description: "Dokumente sammeln", color: "bg-cyan-500" },
  { id: 4, name: "Selbstauskunft", description: "Kunde unterschreibt", color: "bg-teal-500" },
  { id: 5, name: "Finanzierungskonzept", description: "Konzept erstellen", color: "bg-green-500" },
  { id: 6, name: "Angebotsannahme", description: "Angebot präsentieren", color: "bg-lime-500" },
  { id: 7, name: "Objektzusage", description: "Auf Notartermin warten", color: "bg-yellow-500" },
  { id: 8, name: "Antrag & Unterlagen", description: "Bei Bank einreichen", color: "bg-amber-500" },
  { id: 9, name: "Kreditzusage", description: "Bank hat zugesagt", color: "bg-orange-500" },
  { id: 10, name: "Abschluss", description: "Notartermin", color: "bg-rose-500" },
  { id: 11, name: "Nachbetreuung", description: "Kunde betreuen", color: "bg-purple-500" },
];

export const DOCUMENT_TYPES = [
  "Personalausweis",
  "Gehaltsnachweise (3 Monate)",
  "Arbeitsvertrag",
  "Kontoauszüge",
  "Grundbuchauszug",
  "Exposé",
  "Kaufvertragsentwurf",
  "Teilungserklärung",
  "Energieausweis",
  "BWA",
  "Steuerbescheide",
  "Krankenversicherungsnachweis",
];

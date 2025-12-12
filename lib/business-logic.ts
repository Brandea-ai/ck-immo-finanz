/**
 * CK IMMO FINANZ - Business Logic
 * Basiert auf Anforderungs-Analyse und Prozess A-Z Dokumenten
 */

import { Kunde, CustomerType, ObjectType, UsageType, Status, PHASEN } from "@/types";

// ============================================
// MODUL A: Unterlagen-Management
// ============================================

// Pflichtunterlagen je Beschäftigungsart
export const UNTERLAGEN_PERSON: Record<CustomerType, string[]> = {
  angestellt: [
    "Personalausweis (Vorder- + Rückseite)",
    "Gehaltsnachweise (letzte 3 Monate)",
    "Arbeitsvertrag (unbefristet prüfen!)",
    "Kontoauszüge (letzte 3 Monate)",
    "Renteninformation",
    "Eigenkapitalnachweis",
  ],
  selbststaendig: [
    "Personalausweis (Vorder- + Rückseite)",
    "BWA (aktuell, max. 3 Monate alt)",
    "Jahresabschlüsse (letzte 2-3 Jahre)",
    "Einkommensteuerbescheide (letzte 2-3 Jahre)",
    "EÜR oder Bilanz",
    "Kontoauszüge (letzte 3 Monate, privat + geschäftlich)",
    "Krankenversicherungsnachweis",
    "Eigenkapitalnachweis",
  ],
  verbeamtet: [
    "Personalausweis (Vorder- + Rückseite)",
    "Bezügemitteilung (letzte 3 Monate)",
    "Ernennungsurkunde",
    "Kontoauszüge (letzte 3 Monate)",
    "Eigenkapitalnachweis",
  ],
};

// Pflichtunterlagen je Objekttyp
export const UNTERLAGEN_OBJEKT: Record<ObjectType, string[]> = {
  ETW: [
    "Exposé mit Grundriss",
    "Grundbuchauszug (max. 3 Monate alt)",
    "Teilungserklärung (VOLLSTÄNDIG mit allen Nachträgen!)",
    "Wohnflächenberechnung",
    "Energieausweis",
    "Kaufvertragsentwurf",
  ],
  EFH: [
    "Exposé mit Grundriss",
    "Grundbuchauszug (max. 3 Monate alt)",
    "Flurkarte/Lageplan",
    "Wohnflächenberechnung",
    "Baupläne",
    "Energieausweis",
    "Kaufvertragsentwurf",
  ],
  DHH: [
    "Exposé mit Grundriss",
    "Grundbuchauszug (max. 3 Monate alt)",
    "Teilungserklärung (falls vorhanden)",
    "Wohnflächenberechnung",
    "Baupläne",
    "Energieausweis",
    "Kaufvertragsentwurf",
  ],
  MFH: [
    "Exposé mit Grundrissen aller Einheiten",
    "Grundbuchauszug (max. 3 Monate alt)",
    "Teilungserklärung (VOLLSTÄNDIG)",
    "Mieterliste mit Miethöhen",
    "Nebenkostenabrechnung",
    "Wohnflächenberechnung",
    "Energieausweis",
    "Kaufvertragsentwurf",
  ],
  "Grundstück": [
    "Exposé",
    "Grundbuchauszug (max. 3 Monate alt)",
    "Flurkarte/Lageplan",
    "Bebauungsplan/Bauvoranfrage",
    "Kaufvertragsentwurf",
  ],
  Gewerbe: [
    "Exposé mit Grundriss",
    "Grundbuchauszug (max. 3 Monate alt)",
    "Mietvertrag/Pachtvertrag",
    "Flächenberechnung",
    "Energieausweis",
    "Kaufvertragsentwurf",
  ],
};

// Zusätzliche Unterlagen bei Kapitalanlage
export const UNTERLAGEN_KAPITALANLAGE: string[] = [
  "Mietvertrag (aktuell)",
  "Mieterliste mit Miethöhen",
  "Hausgeldabrechnung (bei ETW)",
];

/**
 * Generiert die vollständige Unterlagenliste für einen Kunden
 */
export function getRequiredDocuments(kunde: Kunde): string[] {
  const docs: string[] = [];

  // Persönliche Unterlagen
  docs.push(...UNTERLAGEN_PERSON[kunde.customerType]);

  // Objekt-Unterlagen
  docs.push(...UNTERLAGEN_OBJEKT[kunde.objectType]);

  // Kapitalanlage-Zusatz
  if (kunde.usageType === "kapitalanlage") {
    docs.push(...UNTERLAGEN_KAPITALANLAGE);
  }

  // Deduplizieren
  return [...new Set(docs)];
}

/**
 * Prüft Dokumentenvollständigkeit
 */
export function getDocumentStatus(kunde: Kunde): {
  required: string[];
  missing: string[];
  complete: number; // Prozent
} {
  const required = getRequiredDocuments(kunde);
  const missing = kunde.fehlendeDokumente;
  const received = required.filter(doc => !missing.some(m => doc.includes(m) || m.includes(doc)));

  return {
    required,
    missing,
    complete: Math.round((received.length / required.length) * 100),
  };
}

// ============================================
// MODUL C: Red Flag Erkennung
// ============================================

interface RedFlag {
  id: string;
  message: string;
  severity: "warning" | "critical";
  category: string;
}

/**
 * Erkennt Red Flags basierend auf Kundendaten
 * Aus Anforderungsdokument Modul C
 */
export function detectRedFlags(kunde: Kunde): RedFlag[] {
  const flags: RedFlag[] = [];

  // 1. Dokumente fehlen länger als 5 Tage
  if (kunde.fehlendeDokumente.length > 0 && kunde.tageInPhase >= 5) {
    flags.push({
      id: "docs_overdue",
      message: `${kunde.fehlendeDokumente.length} Dokumente fehlen seit ${kunde.tageInPhase} Tagen`,
      severity: "critical",
      category: "Unterlagen",
    });
  }

  // 2. Stau in Phase (> 3 Tage ohne Fortschritt)
  if (kunde.tageInPhase >= 3 && kunde.phase < 10) {
    const phase = PHASEN.find(p => p.id === kunde.phase);
    if (phase && kunde.tageInPhase > phase.expectedDays) {
      flags.push({
        id: "phase_stuck",
        message: `Überschreitet erwartete ${phase.expectedDays} Tage in Phase ${kunde.phase}`,
        severity: kunde.tageInPhase >= 5 ? "critical" : "warning",
        category: "Prozess",
      });
    }
  }

  // 3. Selbstständige ohne aktuelle BWA
  if (kunde.customerType === "selbststaendig") {
    if (kunde.fehlendeDokumente.some(d => d.toLowerCase().includes("bwa"))) {
      flags.push({
        id: "bwa_missing",
        message: "BWA fehlt - kritisch für Selbstständige",
        severity: "critical",
        category: "Bonität",
      });
    }
  }

  // 4. Teilungserklärung mit Nachträgen prüfen (bei ETW)
  if (kunde.objectType === "ETW") {
    if (kunde.fehlendeDokumente.some(d =>
      d.toLowerCase().includes("teilungserklärung") ||
      d.toLowerCase().includes("nachtrag")
    )) {
      flags.push({
        id: "te_incomplete",
        message: "Teilungserklärung unvollständig - Nachträge prüfen!",
        severity: "critical",
        category: "Objekt",
      });
    }
  }

  // 5. Hohes Finanzierungsvolumen ohne ausreichend Eigenkapital
  if (kunde.eigenkapital && kunde.kaufpreis) {
    const ekQuote = (kunde.eigenkapital / kunde.kaufpreis) * 100;
    if (ekQuote < 10) {
      flags.push({
        id: "ek_low",
        message: `Eigenkapital nur ${ekQuote.toFixed(1)}% - unter 10%`,
        severity: "warning",
        category: "Bonität",
      });
    }
    if (ekQuote < 5) {
      flags.push({
        id: "ek_critical",
        message: `Eigenkapital kritisch niedrig (${ekQuote.toFixed(1)}%)`,
        severity: "critical",
        category: "Bonität",
      });
    }
  }

  // 6. Finanzierungsvolumen vs. Einkommen prüfen
  if (kunde.nettoEinkommen && kunde.finanzierungsvolumen) {
    const faktor = kunde.finanzierungsvolumen / (kunde.nettoEinkommen * 12);
    if (faktor > 8) {
      flags.push({
        id: "income_ratio",
        message: `Finanzierung ${faktor.toFixed(1)}x Jahreseinkommen - prüfen`,
        severity: faktor > 10 ? "critical" : "warning",
        category: "Bonität",
      });
    }
  }

  return flags;
}

// ============================================
// MODUL D: Status-Berechnung (Ampel)
// ============================================

/**
 * Berechnet automatisch den Status basierend auf Regeln
 * GRÜN: Alles OK
 * GELB: Aufmerksamkeit erforderlich
 * ROT: Sofortige Aktion nötig
 */
export function calculateStatus(kunde: Kunde): Status {
  const redFlags = detectRedFlags(kunde);
  const criticalFlags = redFlags.filter(f => f.severity === "critical");
  const warningFlags = redFlags.filter(f => f.severity === "warning");

  // ROT: Kritische Red Flags oder > 5 Tage Stillstand
  if (criticalFlags.length > 0) return "red";
  if (kunde.tageInPhase >= 5 && kunde.phase < 10) return "red";
  if (kunde.fehlendeDokumente.length >= 3) return "red";

  // GELB: Warnungen oder > 3 Tage Stillstand
  if (warningFlags.length > 0) return "yellow";
  if (kunde.tageInPhase >= 3 && kunde.phase < 10) return "yellow";
  if (kunde.fehlendeDokumente.length > 0) return "yellow";

  // GRÜN: Alles in Ordnung
  return "green";
}

// ============================================
// Phasen-Übergangs-Logik
// ============================================

interface PhaseRequirement {
  phase: number;
  canAdvance: boolean;
  blockers: string[];
  nextActions: string[];
}

/**
 * Prüft ob ein Kunde zur nächsten Phase wechseln kann
 */
export function checkPhaseRequirements(kunde: Kunde): PhaseRequirement {
  const blockers: string[] = [];
  const nextActions: string[] = [];

  switch (kunde.phase) {
    case 1: // Lead & Erstkontakt
      nextActions.push("Erstgespräch terminieren");
      nextActions.push("Kontaktdaten vervollständigen");
      break;

    case 2: // Erstgespräch & Bedarfsklärung
      if (!kunde.nettoEinkommen) blockers.push("Einkommen nicht erfasst");
      if (!kunde.kaufpreis) blockers.push("Kaufpreis nicht erfasst");
      nextActions.push("Unterlagenliste erstellen und versenden");
      nextActions.push("Bedarfsanalyse dokumentieren");
      break;

    case 3: // Unterlagenprüfung & Analyse
      if (kunde.fehlendeDokumente.length > 0) {
        blockers.push(`${kunde.fehlendeDokumente.length} Dokumente fehlen noch`);
        nextActions.push("Fehlende Unterlagen anfordern");
      } else {
        nextActions.push("Selbstauskunft erstellen");
        nextActions.push("Bonität prüfen");
      }
      break;

    case 4: // Selbstauskunft
      nextActions.push("Selbstauskunft an Kunden senden");
      nextActions.push("Telefonische Abstimmung zur Prüfung");
      nextActions.push("Unterschrift einholen");
      break;

    case 5: // Finanzierungskonzept
      nextActions.push("Angebote über EuroPace einholen");
      nextActions.push("Konditionen vergleichen");
      nextActions.push("Empfehlung vorbereiten");
      break;

    case 6: // Angebotsbesprechung
      nextActions.push("Angebotstermin vereinbaren");
      nextActions.push("Angebote mit Kunde besprechen");
      nextActions.push("Angebotsannahme einholen");
      break;

    case 7: // Objektzusage & Konditionen
      nextActions.push("Auf Notartermin warten");
      nextActions.push("Konditionen bei Termin aktualisieren");
      nextActions.push("Erneute Angebotsannahme bei Änderung");
      break;

    case 8: // Antrag & Unterlagen
      if (kunde.fehlendeDokumente.length > 0) {
        blockers.push("Unterlagen unvollständig für Bankeinreichung");
      }
      nextActions.push("Finale Unterlagenprüfung");
      nextActions.push("Bei Bank einreichen");
      nextActions.push("Rückfragen klären");
      break;

    case 9: // Kreditzusage & Vertrag
      nextActions.push("Kreditzusage prüfen");
      nextActions.push("Vertragsdetails erklären");
      nextActions.push("Beratungsprotokoll erstellen");
      nextActions.push("Unterschriftstermin");
      break;

    case 10: // Abschluss & Auszahlung
      nextActions.push("Notartermin begleiten");
      nextActions.push("Auszahlung koordinieren");
      nextActions.push("Google-Bewertung anfragen");
      break;

    case 11: // Nachbetreuung
      nextActions.push("Geburtstagsgruß planen");
      nextActions.push("Anschlussfinanzierung tracken");
      nextActions.push("Empfehlungen generieren");
      break;
  }

  return {
    phase: kunde.phase,
    canAdvance: blockers.length === 0 && kunde.phase < 11,
    blockers,
    nextActions,
  };
}

/**
 * Generiert die empfohlene nächste Aktion
 */
export function getRecommendedAction(kunde: Kunde): string {
  const requirements = checkPhaseRequirements(kunde);

  // Wenn Blocker existieren, diese zuerst lösen
  if (requirements.blockers.length > 0) {
    return requirements.blockers[0];
  }

  // Sonst die erste empfohlene Aktion
  if (requirements.nextActions.length > 0) {
    return requirements.nextActions[0];
  }

  return "Status prüfen";
}

// ============================================
// Stau-Erkennung
// ============================================

export interface StauWarnung {
  kundeId: string;
  kundeName: string;
  phase: number;
  tageInPhase: number;
  grund: string;
  empfehlung: string;
}

/**
 * Erkennt Fälle mit Stillstand
 */
export function detectStau(kunden: Kunde[]): StauWarnung[] {
  const warnungen: StauWarnung[] = [];

  for (const kunde of kunden) {
    // Nur aktive Fälle (nicht in Nachbetreuung)
    if (kunde.phase >= 11) continue;

    const phase = PHASEN.find(p => p.id === kunde.phase);
    if (!phase) continue;

    // Stau wenn deutlich über erwarteter Zeit
    if (kunde.tageInPhase > phase.expectedDays + 2) {
      let grund = "Keine Aktivität";
      let empfehlung = "Kunde kontaktieren";

      if (kunde.fehlendeDokumente.length > 0) {
        grund = `${kunde.fehlendeDokumente.length} Dokumente fehlen`;
        empfehlung = "Unterlagen erneut anfordern";
      } else if (kunde.phase === 7) {
        grund = "Wartet auf Objektzusage/Notartermin";
        empfehlung = "Status beim Kunden erfragen";
      } else if (kunde.phase === 8) {
        grund = "Möglicherweise Bank-Rückfragen";
        empfehlung = "Bei Bank nachfassen";
      }

      warnungen.push({
        kundeId: kunde.id,
        kundeName: kunde.name,
        phase: kunde.phase,
        tageInPhase: kunde.tageInPhase,
        grund,
        empfehlung,
      });
    }
  }

  // Nach Dringlichkeit sortieren
  return warnungen.sort((a, b) => b.tageInPhase - a.tageInPhase);
}

// ============================================
// KPI Berechnung
// ============================================

export interface DetailedKPIs {
  // Basis
  pipelineWert: number;
  aktiveFaelle: number;
  abschluesse: number;

  // Status
  kritischeFaelle: number;
  warnungen: number;
  okFaelle: number;

  // Prozess
  neueLeads: number;
  stauFaelle: number;
  durchlaufzeitPhase1bis3: number;

  // Qualität
  unterlagenVollstaendig: number; // Prozent
  redFlagRate: number; // Prozent der Fälle mit Red Flags

  // Pro Berater
  faelleProBerater: Record<string, number>;
  volumenProBerater: Record<string, number>;
}

export function calculateDetailedKPIs(kunden: Kunde[]): DetailedKPIs {
  const aktiveFaelle = kunden.filter(k => k.phase < 11);

  // Durchlaufzeit Phase 1-3
  const phase1bis3 = kunden.filter(k => k.phase >= 1 && k.phase <= 3);
  const durchlaufzeit = phase1bis3.length > 0
    ? Math.round(phase1bis3.reduce((s, k) => s + k.tageInPhase, 0) / phase1bis3.length)
    : 0;

  // Unterlagen-Vollständigkeit
  const mitUnterlagen = aktiveFaelle.filter(k => k.phase >= 3);
  const vollstaendig = mitUnterlagen.filter(k => k.fehlendeDokumente.length === 0).length;
  const unterlagenRate = mitUnterlagen.length > 0
    ? Math.round((vollstaendig / mitUnterlagen.length) * 100)
    : 100;

  // Red Flag Rate
  const mitRedFlags = aktiveFaelle.filter(k => detectRedFlags(k).length > 0).length;
  const redFlagRate = aktiveFaelle.length > 0
    ? Math.round((mitRedFlags / aktiveFaelle.length) * 100)
    : 0;

  // Pro Berater
  const faelleProBerater: Record<string, number> = {};
  const volumenProBerater: Record<string, number> = {};

  for (const kunde of aktiveFaelle) {
    faelleProBerater[kunde.beraterId] = (faelleProBerater[kunde.beraterId] || 0) + 1;
    volumenProBerater[kunde.beraterId] = (volumenProBerater[kunde.beraterId] || 0) + kunde.finanzierungsvolumen;
  }

  return {
    pipelineWert: aktiveFaelle.reduce((s, k) => s + k.finanzierungsvolumen, 0),
    aktiveFaelle: aktiveFaelle.length,
    abschluesse: kunden.filter(k => k.phase >= 10).length,

    kritischeFaelle: kunden.filter(k => calculateStatus(k) === "red").length,
    warnungen: kunden.filter(k => calculateStatus(k) === "yellow").length,
    okFaelle: kunden.filter(k => calculateStatus(k) === "green").length,

    neueLeads: kunden.filter(k => k.phase === 1).length,
    stauFaelle: detectStau(kunden).length,
    durchlaufzeitPhase1bis3: durchlaufzeit,

    unterlagenVollstaendig: unterlagenRate,
    redFlagRate,

    faelleProBerater,
    volumenProBerater,
  };
}

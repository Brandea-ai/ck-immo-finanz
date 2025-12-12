"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useStore, generateId } from "@/lib/store";
import { Kunde, ObjectType, CustomerType, UsageType, PHASEN } from "@/types";
import { cn } from "@/lib/utils";

interface KundeFormModalProps {
  kunde?: Kunde;
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
}

export function KundeFormModal({ kunde, isOpen, onClose, mode }: KundeFormModalProps) {
  const { team, addKunde, updateKunde } = useStore();
  const beraters = team.filter(t => t.role === "GF" || t.role === "BERATER");

  const [formData, setFormData] = useState<Partial<Kunde>>(
    kunde || {
      name: "",
      email: "",
      phone: "",
      address: "",
      finanzierungsvolumen: 0,
      eigenkapital: 0,
      kaufpreis: 0,
      objectType: "ETW" as ObjectType,
      objectAddress: "",
      usageType: "eigennutzer" as UsageType,
      wohnflaeche: 0,
      customerType: "angestellt" as CustomerType,
      nettoEinkommen: 0,
      arbeitgeber: "",
      phase: 1,
      status: "green",
      beraterId: beraters[0]?.id || "",
      naechsteAktion: "Erstkontakt aufnehmen",
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Kunde, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Name ist erforderlich";
    if (!formData.email?.trim()) newErrors.email = "E-Mail ist erforderlich";
    if (!formData.phone?.trim()) newErrors.phone = "Telefon ist erforderlich";
    if (!formData.finanzierungsvolumen || formData.finanzierungsvolumen <= 0) {
      newErrors.finanzierungsvolumen = "Finanzierungsvolumen ist erforderlich";
    }
    if (!formData.beraterId) newErrors.beraterId = "Berater ist erforderlich";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (mode === "create") {
      const newKunde: Kunde = {
        id: generateId(),
        name: formData.name!,
        email: formData.email!,
        phone: formData.phone!,
        address: formData.address,
        finanzierungsvolumen: formData.finanzierungsvolumen!,
        eigenkapital: formData.eigenkapital,
        kaufpreis: formData.kaufpreis,
        objectType: formData.objectType as ObjectType,
        objectAddress: formData.objectAddress,
        usageType: formData.usageType as UsageType,
        wohnflaeche: formData.wohnflaeche,
        customerType: formData.customerType as CustomerType,
        nettoEinkommen: formData.nettoEinkommen,
        arbeitgeber: formData.arbeitgeber,
        phase: formData.phase || 1,
        status: "green",
        beraterId: formData.beraterId!,
        tageInPhase: 0,
        naechsteAktion: formData.naechsteAktion || "Erstkontakt aufnehmen",
        fehlendeDokumente: [],
        activities: [
          {
            id: `act-${Date.now()}`,
            type: "note",
            content: "Kunde angelegt",
            createdAt: new Date().toISOString(),
            createdBy: "System",
          },
        ],
        redFlags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addKunde(newKunde);
    } else if (kunde) {
      updateKunde(kunde.id, formData);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={mode === "create" ? "Neuen Kunden anlegen" : "Kunde bearbeiten"}
    >
      <div className="p-6 space-y-6">
        {/* Persönliche Daten */}
        <section>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 gold-gradient rounded-full" />
            Persönliche Daten
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Name"
              value={formData.name || ""}
              onChange={(v) => handleChange("name", v)}
              error={errors.name}
              required
            />
            <FormField
              label="E-Mail"
              type="email"
              value={formData.email || ""}
              onChange={(v) => handleChange("email", v)}
              error={errors.email}
              required
            />
            <FormField
              label="Telefon"
              value={formData.phone || ""}
              onChange={(v) => handleChange("phone", v)}
              error={errors.phone}
              required
            />
            <FormField
              label="Adresse"
              value={formData.address || ""}
              onChange={(v) => handleChange("address", v)}
            />
          </div>
        </section>

        {/* Einkommen */}
        <section>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 gold-gradient rounded-full" />
            Einkommen & Beschäftigung
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Beschäftigungsart"
              value={formData.customerType || "angestellt"}
              onChange={(v) => handleChange("customerType", v)}
              options={[
                { value: "angestellt", label: "Angestellt" },
                { value: "selbststaendig", label: "Selbstständig" },
                { value: "verbeamtet", label: "Verbeamtet" },
              ]}
            />
            <FormField
              label="Netto-Einkommen (€)"
              type="number"
              value={formData.nettoEinkommen || ""}
              onChange={(v) => handleChange("nettoEinkommen", Number(v))}
            />
            <FormField
              label="Arbeitgeber / Firma"
              value={formData.arbeitgeber || ""}
              onChange={(v) => handleChange("arbeitgeber", v)}
              className="col-span-2"
            />
          </div>
        </section>

        {/* Finanzierung */}
        <section>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 gold-gradient rounded-full" />
            Finanzierung
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              label="Finanzierungsvolumen (€)"
              type="number"
              value={formData.finanzierungsvolumen || ""}
              onChange={(v) => handleChange("finanzierungsvolumen", Number(v))}
              error={errors.finanzierungsvolumen}
              required
            />
            <FormField
              label="Kaufpreis (€)"
              type="number"
              value={formData.kaufpreis || ""}
              onChange={(v) => handleChange("kaufpreis", Number(v))}
            />
            <FormField
              label="Eigenkapital (€)"
              type="number"
              value={formData.eigenkapital || ""}
              onChange={(v) => handleChange("eigenkapital", Number(v))}
            />
          </div>
        </section>

        {/* Objekt */}
        <section>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 gold-gradient rounded-full" />
            Objekt
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Objekttyp"
              value={formData.objectType || "ETW"}
              onChange={(v) => handleChange("objectType", v)}
              options={[
                { value: "ETW", label: "Eigentumswohnung" },
                { value: "EFH", label: "Einfamilienhaus" },
                { value: "DHH", label: "Doppelhaushälfte" },
                { value: "MFH", label: "Mehrfamilienhaus" },
                { value: "Grundstück", label: "Grundstück" },
                { value: "Gewerbe", label: "Gewerbe" },
              ]}
            />
            <FormSelect
              label="Nutzungsart"
              value={formData.usageType || "eigennutzer"}
              onChange={(v) => handleChange("usageType", v)}
              options={[
                { value: "eigennutzer", label: "Eigennutzung" },
                { value: "kapitalanlage", label: "Kapitalanlage" },
              ]}
            />
            <FormField
              label="Objektadresse"
              value={formData.objectAddress || ""}
              onChange={(v) => handleChange("objectAddress", v)}
            />
            <FormField
              label="Wohnfläche (m²)"
              type="number"
              value={formData.wohnflaeche || ""}
              onChange={(v) => handleChange("wohnflaeche", Number(v))}
            />
          </div>
        </section>

        {/* Prozess */}
        <section>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 gold-gradient rounded-full" />
            Prozess
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Berater"
              value={formData.beraterId || ""}
              onChange={(v) => handleChange("beraterId", v)}
              options={beraters.map((b) => ({ value: b.id, label: b.name }))}
              error={errors.beraterId}
              required
            />
            <FormSelect
              label="Startphase"
              value={String(formData.phase || 1)}
              onChange={(v) => handleChange("phase", Number(v))}
              options={PHASEN.map((p) => ({ value: String(p.id), label: `${p.id}. ${p.name}` }))}
            />
            <FormField
              label="Nächste Aktion"
              value={formData.naechsteAktion || ""}
              onChange={(v) => handleChange("naechsteAktion", v)}
              className="col-span-2"
            />
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 bg-slate-50 flex items-center justify-end gap-3">
        <button
          onClick={onClose}
          className="h-10 px-4 rounded-xl border border-gray-200 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
        >
          Abbrechen
        </button>
        <button
          onClick={handleSubmit}
          className="h-10 px-6 rounded-xl gold-gradient text-white text-sm font-medium shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
        >
          {mode === "create" ? "Kunde anlegen" : "Speichern"}
        </button>
      </div>
    </Modal>
  );
}

// Form Field Component
interface FormFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "email" | "number";
  error?: string;
  required?: boolean;
  className?: string;
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  error,
  required,
  className,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full h-10 px-3 rounded-xl border text-sm transition-all",
          "focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500",
          error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
        )}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

// Form Select Component
interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}

function FormSelect({ label, value, onChange, options, error, required }: FormSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full h-10 px-3 rounded-xl border text-sm transition-all",
          "focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500",
          error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

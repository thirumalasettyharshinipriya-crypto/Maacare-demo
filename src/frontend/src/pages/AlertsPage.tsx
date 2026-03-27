import { useState } from "react";
import { store } from "../store";
import type { EmergencyAlert, EmergencyContact } from "../types";

function CallCard({
  emoji,
  label,
  name,
  phone,
  gradient,
  ocidPrefix,
  onAdd,
}: {
  emoji: string;
  label: string;
  name?: string;
  phone?: string;
  gradient: string;
  ocidPrefix: string;
  onAdd?: () => void;
}) {
  if (!phone) {
    return (
      <div
        className="rounded-2xl p-4 flex flex-col items-center gap-2 border-2 border-dashed"
        style={{
          borderColor: "oklch(0.82 0.06 15)",
          background: "oklch(0.98 0.01 15)",
        }}
      >
        <span className="text-3xl opacity-50">{emoji}</span>
        <p className="text-xs font-bold text-muted-foreground">{label}</p>
        <button
          type="button"
          data-ocid={`${ocidPrefix}.add.button`}
          onClick={onAdd}
          className="text-xs font-bold px-3 py-1.5 rounded-full text-white mt-1"
          style={{ background: "oklch(0.52 0.2 15)" }}
        >
          + Add
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-4 flex flex-col items-center gap-1.5 text-white shadow-md"
      style={{ background: gradient }}
    >
      <span className="text-3xl">{emoji}</span>
      <p className="text-[10px] font-bold opacity-80 uppercase tracking-wide">
        {label}
      </p>
      {name && (
        <p className="font-bold text-sm text-center leading-tight">{name}</p>
      )}
      <p className="text-xs opacity-85 font-mono">{phone}</p>
      <a
        href={`tel:${phone}`}
        data-ocid={`${ocidPrefix}.call.button`}
        className="mt-1.5 w-full text-center text-sm font-bold py-2 rounded-xl transition-all active:scale-95"
        style={{
          background: "oklch(1 0 0 / 0.25)",
          backdropFilter: "blur(8px)",
        }}
      >
        📞 Call Now
      </a>
    </div>
  );
}

export default function AlertsPage({
  onNavigate,
}: { onNavigate?: (tab: string) => void }) {
  const patient = store.getPatient();
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(store.getAlerts);
  const [contacts, setContacts] = useState<EmergencyContact[]>(
    patient?.emergencyContacts ?? [],
  );
  const [newC, setNewC] = useState({ name: "", phone: "", relation: "" });
  const [showForm, setShowForm] = useState(false);
  const [quickDoctor, setQuickDoctor] = useState(false);

  function addContact() {
    if (!newC.name || !newC.phone) return;
    const updated = [...contacts, newC];
    setContacts(updated);
    if (patient) store.savePatient({ ...patient, emergencyContacts: updated });
    setNewC({ name: "", phone: "", relation: "" });
    setShowForm(false);
    setQuickDoctor(false);
  }

  function triggerAlert() {
    const p = store.getPatient();
    const alert: EmergencyAlert = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      contactsNotified: contacts.map((c) => `${c.name} (${c.phone})`),
      conditionSummary:
        store.getSymptoms()[0]?.aiSuggestion ?? "Emergency button pressed",
      locationPlaceholder: p ? `${p.village}, District` : "Location not set",
      status: "sent",
    };
    store.addAlert(alert);
    setAlerts(store.getAlerts());
  }

  // Derive contacts for the call cards
  const doctorContact = contacts.find(
    (c) => c.relation?.toLowerCase() === "doctor",
  );
  const familyContacts = contacts
    .filter((c) => c.relation?.toLowerCase() !== "doctor")
    .slice(0, 3);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-red-700">
        🆘 Emergency Alerts / आपातकाल / అత్యవసర అలర్ట్
      </h2>

      {/* ONE-TAP CALL SECTION */}
      <div className="bg-card rounded-3xl border border-border shadow-sm p-4">
        <h3 className="font-bold text-base text-foreground mb-3">
          📞 One-Tap Emergency Calls
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {/* ASHA Worker */}
          <CallCard
            emoji="👩‍⚕️"
            label="ASHA Worker"
            name="ASHA Worker"
            phone={patient?.ashaWorkerPhone}
            gradient="linear-gradient(135deg, oklch(0.52 0.2 15), oklch(0.62 0.18 340))"
            ocidPrefix="alerts.asha"
            onAdd={() => onNavigate?.("home")}
          />
          {/* Doctor */}
          <CallCard
            emoji="🩺"
            label="Doctor"
            name={doctorContact?.name}
            phone={doctorContact?.phone}
            gradient="linear-gradient(135deg, oklch(0.45 0.18 240), oklch(0.55 0.2 220))"
            ocidPrefix="alerts.doctor"
            onAdd={() => {
              setNewC({ name: "Doctor", phone: "", relation: "Doctor" });
              setQuickDoctor(true);
              setShowForm(true);
            }}
          />
          {/* Family */}
          <CallCard
            emoji="👨‍👩‍👧"
            label={
              familyContacts.length > 0 ? familyContacts[0].name : "Family"
            }
            name={
              familyContacts.length > 0 ? familyContacts[0].relation : undefined
            }
            phone={familyContacts[0]?.phone}
            gradient="linear-gradient(135deg, oklch(0.45 0.18 145), oklch(0.55 0.2 150))"
            ocidPrefix="alerts.family"
            onAdd={() => {
              setNewC({ name: "", phone: "", relation: "Family" });
              setShowForm(true);
            }}
          />
        </div>
        {familyContacts.length > 1 && (
          <div className="mt-2 space-y-1">
            {familyContacts.slice(1).map((c) => (
              <a
                key={`${c.name}-${c.phone}`}
                href={`tel:${c.phone}`}
                data-ocid="alerts.family.call.button"
                className="flex items-center gap-3 px-3 py-2 rounded-xl border border-border bg-muted hover:bg-card transition-colors"
              >
                <span className="text-lg">👤</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {c.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{c.phone}</p>
                </div>
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full text-white"
                  style={{ background: "oklch(0.45 0.18 145)" }}
                >
                  📞 Call
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* SOS Button */}
      <button
        type="button"
        data-ocid="alerts.primary_button"
        onClick={triggerAlert}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xl py-6 rounded-2xl flex items-center justify-center gap-3 animate-pulse shadow-xl"
      >
        🆘 Send Emergency Alert / आपातकालीन अलर्ट भेजें / అత్యవసర అలర్ట్ పంపండి
      </button>

      <button
        type="button"
        data-ocid="alerts.secondary_button"
        onClick={() => onNavigate?.("hospitals")}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg"
      >
        🏥 Find Nearby Hospitals / नजदीकी अस्पताल / సమీప ఆసుపత్రులు
      </button>

      {patient && (
        <div className="bg-white rounded-xl p-4 border border-rose-100 shadow">
          <p className="text-sm font-semibold text-gray-600">
            📍 Location / स्थान / స్థానం
          </p>
          <p className="text-lg font-bold text-gray-800">
            {patient.village}, District
          </p>
          <p className="text-xs text-gray-400">
            GPS placeholder – location based on village
          </p>
        </div>
      )}

      {/* Contacts Management */}
      <div className="bg-white rounded-2xl shadow-md p-4 border border-rose-100">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg text-rose-700">
            📞 Emergency Contacts / అత్యవసర సంప్రదింపులు
          </h3>
          <button
            type="button"
            data-ocid="alerts.contact.open_modal_button"
            onClick={() => {
              setQuickDoctor(false);
              setShowForm((f) => !f);
            }}
            className="bg-rose-100 text-rose-600 font-bold px-3 py-1 rounded-lg text-sm"
          >
            + Add
          </button>
        </div>

        {/* Quick Add Doctor */}
        {!showForm && !doctorContact && (
          <button
            type="button"
            data-ocid="alerts.doctor.open_modal_button"
            onClick={() => {
              setNewC({ name: "Doctor", phone: "", relation: "Doctor" });
              setQuickDoctor(true);
              setShowForm(true);
            }}
            className="w-full mb-3 flex items-center gap-2 justify-center py-2 rounded-xl border-2 border-dashed border-blue-200 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors"
          >
            🩺 + Add Doctor Contact
          </button>
        )}

        {showForm && (
          <div className="space-y-2 mb-3 bg-rose-50 p-3 rounded-xl">
            {quickDoctor && (
              <p className="text-sm font-bold text-blue-700">
                🩺 Add Doctor Contact
              </p>
            )}
            {(["name", "phone", "relation"] as const).map((k) => (
              <input
                key={k}
                data-ocid={`alerts.contact.${k}.input`}
                placeholder={k.charAt(0).toUpperCase() + k.slice(1)}
                value={newC[k]}
                onChange={(e) =>
                  setNewC((c) => ({ ...c, [k]: e.target.value }))
                }
                className="w-full border border-rose-200 rounded-lg px-3 py-2 text-base"
              />
            ))}
            <button
              type="button"
              data-ocid="alerts.contact.submit_button"
              onClick={addContact}
              className="w-full bg-rose-500 text-white font-bold py-2 rounded-lg"
            >
              Save Contact / సంప్రదింపు సేవ్ చేయండి
            </button>
          </div>
        )}

        {patient?.ashaWorkerPhone && (
          <div className="flex items-center gap-3 py-2 border-b border-gray-100">
            <span className="text-2xl">👩‍⚕️</span>
            <div>
              <p className="font-semibold">ASHA Worker</p>
              <p className="text-sm text-gray-500">{patient.ashaWorkerPhone}</p>
            </div>
          </div>
        )}
        {contacts.map((c) => (
          <div
            key={`${c.name}-${c.phone}`}
            className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
          >
            <span className="text-2xl">👤</span>
            <div>
              <p className="font-semibold">
                {c.name}{" "}
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                  {c.relation}
                </span>
              </p>
              <p className="text-sm text-gray-500">{c.phone}</p>
            </div>
          </div>
        ))}
        {contacts.length === 0 && !patient?.ashaWorkerPhone && (
          <p className="text-gray-400 text-sm text-center py-2">
            No contacts added yet / ఇంకా సంప్రదింపులు జోడించబడలేదు
          </p>
        )}
      </div>

      {/* Alert History */}
      <div className="bg-white rounded-2xl shadow-md p-4 border border-rose-100">
        <h3 className="font-bold text-lg text-rose-700 mb-3">
          📋 Alert History / इतिहास / అలర్ట్ చరిత్ర
        </h3>
        {alerts.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-2">
            No alerts sent yet / ఇంకా అలర్ట్‌లు పంపబడలేదు
          </p>
        )}
        {alerts.map((a) => (
          <div
            key={a.id}
            className="py-3 border-b border-gray-100 last:border-0"
          >
            <div className="flex justify-between items-start">
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  a.status === "acknowledged"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {a.status === "acknowledged" ? "✅ Acknowledged" : "📤 Sent"}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(a.timestamp).toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-1">{a.conditionSummary}</p>
            <p className="text-xs text-gray-400">📍 {a.locationPlaceholder}</p>
            <p className="text-xs text-gray-400">
              Notified: {a.contactsNotified.join(", ") || "None"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

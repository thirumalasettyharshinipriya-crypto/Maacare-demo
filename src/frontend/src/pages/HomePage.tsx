import { useState } from "react";
import RiskBadge from "../components/RiskBadge";
import { useLang } from "../context/LangContext";
import { computePregnancyInfo, store } from "../store";
import type { EmergencyAlert, PatientProfile, SymptomLog } from "../types";
import { analyzeRisk } from "../utils/riskEngine";

const SYMPTOM_OPTIONS = [
  "Bleeding",
  "Severe Pain",
  "No Baby Movement",
  "Fever",
  "Dizziness",
  "Mild Pain",
  "Nausea",
  "Swelling",
  "Backache",
  "Normal Discomfort",
];

export default function HomePage({
  onNavigate,
}: { onNavigate: (t: string) => void }) {
  const [patient, setPatient] = useState<PatientProfile | null>(
    store.getPatient,
  );
  const [showSetup, setShowSetup] = useState(!patient);
  const [form, setForm] = useState({
    name: "",
    age: "",
    village: "",
    phone: "",
    lmpDate: "",
    ashaPhone: "",
    doctorPhone: "",
  });
  const [selected, setSelected] = useState<string[]>([]);
  const [lastRisk, setLastRisk] = useState<ReturnType<
    typeof analyzeRisk
  > | null>(null);
  const [alertSent, setAlertSent] = useState(false);
  const { t } = useLang();

  function saveProfile() {
    if (!form.name || !form.lmpDate) return;
    const { week, edd, trimester } = computePregnancyInfo(form.lmpDate);
    const emergencyContacts = form.doctorPhone
      ? [{ name: "Doctor", phone: form.doctorPhone, relation: "Doctor" }]
      : [];
    const p: PatientProfile = {
      id: Date.now().toString(),
      name: form.name,
      age: Number(form.age),
      village: form.village,
      phone: form.phone,
      lmpDate: form.lmpDate,
      edd,
      trimester,
      pregnancyWeek: week,
      emergencyContacts,
      ashaWorkerName: "",
      ashaWorkerPhone: form.ashaPhone,
    };
    store.savePatient(p);
    setPatient(p);
    setShowSetup(false);
  }

  function logSymptoms() {
    if (!selected.length) return;
    const risk = analyzeRisk(selected.join(" "));
    const log: SymptomLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      symptoms: selected,
      riskLevel: risk.riskLevel,
      aiSuggestion: risk.suggestion,
      voiceInputUsed: false,
      language: "en",
    };
    store.addSymptom(log);
    setLastRisk(risk);
    setSelected([]);
  }

  function sendSOS() {
    const p = store.getPatient();
    const alert: EmergencyAlert = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      contactsNotified: p
        ? [p.ashaWorkerPhone, ...p.emergencyContacts.map((c) => c.phone)]
        : ["Unknown"],
      conditionSummary: lastRisk?.suggestion ?? "Emergency triggered",
      locationPlaceholder: p ? `${p.village}, District` : "Location not set",
      status: "sent",
    };
    store.addAlert(alert);
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 4000);
  }

  if (showSetup)
    return (
      <div className="p-4 space-y-4">
        <div
          className="rounded-3xl p-6 text-white mb-2"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.52 0.2 15), oklch(0.62 0.18 340))",
          }}
        >
          <p className="text-3xl mb-1">👶</p>
          <h2 className="text-2xl font-bold leading-tight">Create Profile</h2>
          <p className="text-sm opacity-80 mt-1">प्रोफ़ाइल बनाएं · మీ ప్రొఫైల్ సెటప్</p>
        </div>

        {(
          [
            ["name", "Your Name / आपका नाम / మీ పేరు", "text"],
            ["age", "Age / उम्र / వయసు", "number"],
            ["village", "Village / गाँव / గ్రామం", "text"],
            ["phone", "Phone Number / फोन / ఫోన్", "tel"],
            ["lmpDate", "Last Period Date / అంతిమ మాసిక ధర్మ తారీఖ్", "date"],
            ["ashaPhone", "ASHA Worker Phone / ASHA వర్కర్ ఫోన్", "tel"],
            ["doctorPhone", "Doctor's Phone / डॉक्टर का फोन / డాక్టర్ ఫోన్", "tel"],
          ] as [string, string, string][]
        ).map(([k, lbl, type]) => (
          <div key={k}>
            <p className="text-sm font-semibold text-foreground mb-1.5">
              {lbl}
            </p>
            <input
              id={`field-${k}`}
              data-ocid={`profile.${k}.input`}
              type={type}
              value={(form as Record<string, string>)[k]}
              onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
              className="w-full border-2 border-border rounded-2xl px-4 py-3.5 text-base font-medium focus:border-primary outline-none bg-card transition-colors"
            />
          </div>
        ))}
        <button
          type="button"
          data-ocid="profile.submit_button"
          onClick={saveProfile}
          className="w-full text-white font-bold text-xl py-5 rounded-2xl mt-2 shadow-rose-md transition-all active:scale-95"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.52 0.2 15), oklch(0.58 0.22 340))",
          }}
        >
          {t.save} & Continue ✓
        </button>
      </div>
    );

  const info = patient ? computePregnancyInfo(patient.lmpDate) : null;

  return (
    <div className="p-4 space-y-4">
      {/* Hero Profile Card */}
      {patient && info && (
        <div
          className="rounded-3xl p-5 text-white shadow-rose-lg relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.52 0.2 15), oklch(0.62 0.18 340))",
          }}
        >
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
            style={{ background: "oklch(0.9 0.05 15)" }}
          />
          <div className="relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-2xl font-bold">{patient.name}</p>
                <p className="text-sm opacity-80">📍 {patient.village}</p>
              </div>
              <span
                className="font-bold px-3 py-1.5 rounded-full text-sm"
                style={{
                  background: "oklch(1 0 0 / 0.25)",
                  backdropFilter: "blur(8px)",
                }}
              >
                T{info.trimester} · Week {info.week}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-2xl p-3 text-center"
                style={{
                  background: "oklch(1 0 0 / 0.15)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <p className="text-4xl font-bold">{info.week}</p>
                <p className="text-xs opacity-80 mt-0.5">Weeks Pregnant</p>
                <p className="text-xs opacity-60">सप्ताह · సప్తాహాలు</p>
              </div>
              <div
                className="rounded-2xl p-3 text-center"
                style={{
                  background: "oklch(1 0 0 / 0.15)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <p className="text-base font-bold">
                  {new Date(info.edd).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs opacity-80 mt-0.5">Due Date</p>
                <p className="text-xs opacity-60">నియమిత తేదీ</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          data-ocid="home.voice.primary_button"
          onClick={() => onNavigate("voice")}
          className="text-white font-bold text-base py-5 rounded-2xl flex flex-col items-center gap-2 shadow-rose-md transition-all active:scale-95"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.52 0.2 15), oklch(0.58 0.22 340))",
          }}
        >
          <span className="text-3xl">🎤</span>
          <span>Speak Problem</span>
          <span className="text-xs opacity-75 font-normal">अपनी समस्या बोलें</span>
        </button>
        <button
          type="button"
          data-ocid="home.tools.primary_button"
          onClick={() => onNavigate("tools")}
          className="text-white font-bold text-base py-5 rounded-2xl flex flex-col items-center gap-2 shadow-rose-md transition-all active:scale-95"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.55 0.18 300), oklch(0.6 0.2 340))",
          }}
        >
          <span className="text-3xl">🛠️</span>
          <span>Smart Tools</span>
          <span className="text-xs opacity-75 font-normal">స్మార్ట్ టూల్స్</span>
        </button>
      </div>

      {/* SOS Button */}
      <button
        type="button"
        data-ocid="home.sos.primary_button"
        onClick={sendSOS}
        className="w-full text-white font-bold text-2xl py-5 rounded-2xl flex items-center justify-center gap-3 shadow-rose-lg transition-all active:scale-95"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.5 0.24 25), oklch(0.55 0.22 15))",
          animation: "pulse 2s infinite",
        }}
      >
        <span className="text-3xl">🆘</span>
        <span>
          {t.sos}
          <br />
          <span className="text-sm font-normal">आपातकाल · అత్యవసర</span>
        </span>
      </button>

      {alertSent && (
        <div
          data-ocid="home.sos.success_state"
          className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-4 text-center font-semibold shadow-sm"
        >
          ✅ Alert sent to emergency contacts!
          <br />
          <span className="text-xs font-normal">
            అత్యవసర సంప్రదింపులకు అలర్ట్ పంపబడింది!
          </span>
        </div>
      )}

      {/* Symptom Logger */}
      <div className="bg-card rounded-3xl shadow-rose-sm p-5 border border-border">
        <h3 className="font-bold text-lg text-primary mb-3">
          📝 {t.logSymptoms}
          <span className="text-sm font-normal text-muted-foreground ml-2">
            लक्षण दर्ज करें · లక్షణాలు
          </span>
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {SYMPTOM_OPTIONS.map((s) => (
            <button
              type="button"
              key={s}
              data-ocid={`symptom.${s.toLowerCase().replace(/ /g, "_")}.toggle`}
              onClick={() =>
                setSelected((prev) =>
                  prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
                )
              }
              className={`px-3 py-2 rounded-full text-sm font-semibold border-2 transition-all active:scale-95 ${
                selected.includes(s)
                  ? "border-primary text-primary-foreground"
                  : "bg-card text-foreground border-border hover:border-primary"
              }`}
              style={
                selected.includes(s) ? { background: "oklch(0.52 0.2 15)" } : {}
              }
            >
              {s}
            </button>
          ))}
        </div>
        {selected.length > 0 && (
          <button
            type="button"
            data-ocid="symptom.analyze.primary_button"
            onClick={logSymptoms}
            className="w-full text-white font-bold py-4 rounded-2xl shadow-rose-sm transition-all active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.52 0.2 15), oklch(0.58 0.22 340))",
            }}
          >
            Analyze {t.risk} →
          </button>
        )}
        {lastRisk && (
          <div
            data-ocid="symptom.risk.card"
            className={`mt-3 p-4 rounded-2xl border-2 ${
              lastRisk.riskLevel === "high"
                ? "bg-red-50 border-red-300"
                : lastRisk.riskLevel === "medium"
                  ? "bg-amber-50 border-amber-300"
                  : "bg-green-50 border-green-300"
            }`}
          >
            <RiskBadge level={lastRisk.riskLevel} />
            <p className="mt-2 text-sm font-medium text-foreground">
              {lastRisk.suggestion}
            </p>
            <p className="mt-1 text-xs text-muted-foreground italic">
              ⚠️ Not a replacement for a doctor · డాక్టర్‌కు ప్రత్యామ్నాయం కాదు
            </p>
          </div>
        )}
      </div>

      {/* Recent Logs */}
      {store.getSymptoms().slice(0, 3).length > 0 && (
        <div className="bg-card rounded-3xl shadow-rose-sm p-4 border border-border">
          <h3 className="font-bold text-base text-primary mb-3">
            🕐 Recent / हाल की जानकारी / ఇటీవలి
          </h3>
          {store
            .getSymptoms()
            .slice(0, 3)
            .map((s, i) => (
              <div
                key={s.id}
                data-ocid={`recent.item.${i + 1}`}
                className="flex items-center gap-2 py-2.5 border-b border-border last:border-0"
              >
                <RiskBadge level={s.riskLevel} />
                <span className="text-sm text-foreground flex-1">
                  {s.symptoms.join(", ")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(s.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          className="underline hover:text-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}

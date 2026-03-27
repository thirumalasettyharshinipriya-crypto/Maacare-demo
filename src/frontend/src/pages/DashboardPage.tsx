import { useState } from "react";
import RiskBadge from "../components/RiskBadge";
import { useLang } from "../context/LangContext";
import { computePregnancyInfo, store } from "../store";
import type { ASHAWorker, VisitRecord } from "../types";

function riskBorderColor(level: string) {
  if (level === "high") return "border-l-red-500";
  if (level === "medium") return "border-l-orange-400";
  return "border-l-green-500";
}

function riskBg(level: string) {
  if (level === "high") return "bg-red-50";
  if (level === "medium") return "bg-orange-50";
  return "bg-green-50";
}

export default function DashboardPage() {
  const [tab, setTab] = useState<"health" | "asha">("health");
  const symptoms = store.getSymptoms();
  const [workers, setWorkers] = useState<ASHAWorker[]>(() => store.getASHA());
  const [visits, setVisits] = useState<VisitRecord[]>(() => store.getVisits());
  const [showWorkerForm, setShowWorkerForm] = useState(false);
  const [wForm, setWForm] = useState({ name: "", phone: "", village: "" });
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [vForm, setVForm] = useState({
    patientName: "",
    ashaWorkerId: "",
    scheduledDate: "",
    notes: "",
  });
  const patient = store.getPatient();
  const info = patient ? computePregnancyInfo(patient.lmpDate) : null;
  const { t } = useLang();

  function addWorker() {
    if (!wForm.name) return;
    const w: ASHAWorker = { id: Date.now().toString(), ...wForm };
    const updated = [...workers, w];
    setWorkers(updated);
    store.saveASHA(updated);
    setWForm({ name: "", phone: "", village: "" });
    setShowWorkerForm(false);
  }

  function addVisit() {
    if (!vForm.patientName || !vForm.scheduledDate) return;
    const v: VisitRecord = {
      id: Date.now().toString(),
      ...vForm,
      completed: false,
    };
    const updated = [...visits, v];
    setVisits(updated);
    store.saveVisits(updated);
    setVForm({
      patientName: "",
      ashaWorkerId: "",
      scheduledDate: "",
      notes: "",
    });
    setShowVisitForm(false);
  }

  function completeVisit(id: string) {
    const updated = visits.map((v) =>
      v.id === id ? { ...v, completed: true } : v,
    );
    setVisits(updated);
    store.saveVisits(updated);
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-rose-700">
        📋 {t.dashboard} / डैशबोर्ड / డాష్‌బోర్డ్
      </h2>

      <div className="flex gap-2">
        {(["health", "asha"] as const).map((tb) => (
          <button
            type="button"
            key={tb}
            onClick={() => setTab(tb)}
            className={`flex-1 py-3 rounded-xl font-bold border-2 ${
              tab === tb
                ? "bg-rose-500 text-white border-rose-500"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {tb === "health" ? "💊 My Health / నా ఆరోగ్యం" : "👩‍⚕️ ASHA Worker"}
          </button>
        ))}
      </div>

      {tab === "health" ? (
        <>
          {patient && info && (
            <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200">
              <p className="font-bold text-rose-700 text-lg">{patient.name}</p>
              <p className="text-sm text-gray-600">
                {patient.village} · Week {info.week} · Trimester{" "}
                {info.trimester}
              </p>
              <p className="text-sm text-gray-600">
                Due: {new Date(info.edd).toLocaleDateString("en-IN")}
              </p>
              {symptoms[0] && (
                <div className="mt-2">
                  <RiskBadge level={symptoms[0].riskLevel} />
                </div>
              )}
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-md p-4 border border-rose-100">
            <h3 className="font-bold text-lg text-rose-700 mb-3">
              🕐 Health History / स्वास्थ्य इतिहास / ఆరోగ్య చరిత్ర
            </h3>
            {symptoms.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">
                No symptom logs yet / ఇంకా లక్షణాల లాగ్‌లు లేవు
              </p>
            )}
            {symptoms.map((s) => (
              <div
                key={s.id}
                className="py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex justify-between items-center mb-1">
                  <RiskBadge level={s.riskLevel} />
                  <span className="text-xs text-gray-400">
                    {new Date(s.timestamp).toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{s.symptoms.join(", ")}</p>
                <p className="text-xs text-gray-500 italic mt-1">
                  {s.aiSuggestion}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* ── Patient Symptom Reports Feed for ASHA ── */}
          <div className="bg-white rounded-2xl shadow-md p-4 border border-rose-100">
            <h3 className="font-bold text-lg text-rose-700 mb-1">
              🩺 Patient Symptom Reports
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              రోగి లక్షణ నివేదికలు · मरीज के लक्षण
            </p>
            {symptoms.length === 0 ? (
              <p
                data-ocid="asha.symptoms.empty_state"
                className="text-gray-400 text-sm text-center py-6"
              >
                No symptom reports yet / ఇంకా నివేదికలు లేవు
              </p>
            ) : (
              <div className="space-y-3">
                {symptoms.map((s, i) => (
                  <div
                    key={s.id}
                    data-ocid={`asha.symptoms.item.${i + 1}`}
                    className={`border-l-4 pl-3 pr-3 py-3 rounded-r-xl ${riskBorderColor(s.riskLevel)} ${riskBg(s.riskLevel)}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <RiskBadge level={s.riskLevel} />
                      <span className="text-xs text-gray-500">
                        {new Date(s.timestamp).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {s.symptoms.map((sym) => (
                        <span
                          key={sym}
                          className="text-xs bg-white border border-gray-200 text-gray-700 font-medium px-2 py-0.5 rounded-full"
                        >
                          {sym}
                        </span>
                      ))}
                    </div>
                    {s.aiSuggestion && (
                      <p className="text-xs text-gray-600 mt-2 italic">
                        💡 {s.aiSuggestion}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ASHA Workers List */}
          <div className="bg-white rounded-2xl shadow-md p-4 border border-rose-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg text-rose-700">
                👩‍⚕️ ASHA Workers
              </h3>
              <button
                type="button"
                onClick={() => setShowWorkerForm((f) => !f)}
                className="bg-rose-100 text-rose-600 font-bold px-3 py-1 rounded-lg text-sm"
              >
                + Add
              </button>
            </div>
            {showWorkerForm && (
              <div className="space-y-2 mb-3 bg-rose-50 p-3 rounded-xl">
                {(["name", "phone", "village"] as const).map((k) => (
                  <input
                    key={k}
                    placeholder={k.charAt(0).toUpperCase() + k.slice(1)}
                    value={wForm[k]}
                    onChange={(e) =>
                      setWForm((f) => ({ ...f, [k]: e.target.value }))
                    }
                    className="w-full border border-rose-200 rounded-lg px-3 py-2 text-base"
                  />
                ))}
                <button
                  type="button"
                  onClick={addWorker}
                  className="w-full bg-rose-500 text-white font-bold py-2 rounded-lg"
                >
                  {t.save} / సేవ్ చేయండి
                </button>
              </div>
            )}
            {workers.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-2">
                No ASHA workers added / ASHA వర్కర్లు జోడించబడలేదు
              </p>
            )}
            {workers.map((w) => (
              <div
                key={w.id}
                className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-2xl">👩‍⚕️</span>
                <div>
                  <p className="font-semibold">{w.name}</p>
                  <p className="text-sm text-gray-500">
                    {w.phone} · {w.village}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {patient && (
            <div className="bg-white rounded-2xl shadow-md p-4 border border-rose-100">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-rose-700">
                  📅 Visit Records / సందర్శన రికార్డులు
                </h3>
                <button
                  type="button"
                  onClick={() => setShowVisitForm((f) => !f)}
                  className="bg-rose-100 text-rose-600 font-bold px-3 py-1 rounded-lg text-sm"
                >
                  + Schedule
                </button>
              </div>
              {showVisitForm && (
                <div className="space-y-2 mb-3 bg-rose-50 p-3 rounded-xl">
                  <input
                    placeholder="Patient Name / రోగి పేరు"
                    value={vForm.patientName}
                    onChange={(e) =>
                      setVForm((f) => ({ ...f, patientName: e.target.value }))
                    }
                    className="w-full border border-rose-200 rounded-lg px-3 py-2"
                  />
                  <select
                    value={vForm.ashaWorkerId}
                    onChange={(e) =>
                      setVForm((f) => ({ ...f, ashaWorkerId: e.target.value }))
                    }
                    className="w-full border border-rose-200 rounded-lg px-3 py-2"
                  >
                    <option value="">
                      Select ASHA Worker / ASHA వర్కర్ ఎంచుకోండి
                    </option>
                    {workers.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={vForm.scheduledDate}
                    onChange={(e) =>
                      setVForm((f) => ({ ...f, scheduledDate: e.target.value }))
                    }
                    className="w-full border border-rose-200 rounded-lg px-3 py-2"
                  />
                  <input
                    placeholder="Notes / గమనికలు"
                    value={vForm.notes}
                    onChange={(e) =>
                      setVForm((f) => ({ ...f, notes: e.target.value }))
                    }
                    className="w-full border border-rose-200 rounded-lg px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={addVisit}
                    className="w-full bg-rose-500 text-white font-bold py-2 rounded-lg"
                  >
                    Schedule Visit / సందర్శన షెడ్యూల్ చేయండి
                  </button>
                </div>
              )}
              {visits.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-2">
                  No visits scheduled / సందర్శనలు షెడ్యూల్ చేయబడలేదు
                </p>
              )}
              {visits.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-semibold text-sm">{v.patientName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(v.scheduledDate).toLocaleDateString("en-IN")} ·{" "}
                      {v.notes}
                    </p>
                  </div>
                  {v.completed ? (
                    <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-1 rounded-full">
                      ✅ Done
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => completeVisit(v.id)}
                      className="text-xs bg-rose-100 text-rose-600 font-bold px-2 py-1 rounded-full"
                    >
                      Mark Done / పూర్తయింది
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

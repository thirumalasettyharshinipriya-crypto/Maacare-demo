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
  const role = localStorage.getItem("role") || "PATIENT";
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
  const [activeTab, setActiveTab] = useState<'symptoms' | 'workers' | 'visits'>('symptoms');
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
        📋 Dashboard
      </h2>

      {/* Tab Buttons */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('symptoms')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
            activeTab === 'symptoms'
              ? 'bg-white text-rose-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          🩺 Symptoms
        </button>
        <button
          onClick={() => setActiveTab('workers')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
            activeTab === 'workers'
              ? 'bg-white text-rose-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          👩‍⚕️ Workers
        </button>
        <button
          onClick={() => setActiveTab('visits')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
            activeTab === 'visits'
              ? 'bg-white text-rose-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📅 Visits
        </button>
      </div>

      {/* Active Tab Content */}
      {activeTab === 'symptoms' && (
        <div className="bg-white rounded-2xl shadow-md p-4 border border-rose-100">
          <h3 className="font-bold text-lg text-rose-700 mb-3">
            🩺 Patient Symptom Reports
          </h3>
          {symptoms.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">
              No symptom reports yet / ఇంకా నివేదికలు లేవు
            </p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {symptoms.slice(0, 5).map((s) => (
                <div
                  key={s.id}
                  className={`border-l-4 pl-3 pr-3 py-2 rounded-r-xl ${riskBorderColor(s.riskLevel)} ${riskBg(s.riskLevel)}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <RiskBadge level={s.riskLevel} />
                    <span className="text-xs text-gray-500">
                      {new Date(s.timestamp).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{s.symptoms.join(", ")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'workers' && (
        <div className="bg-white rounded-2xl shadow-md p-4 border border-rose-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg text-rose-700">
              👩‍⚕️ ASHA Workers
            </h3>
            <button
              type="button"
              onClick={() => setShowWorkerForm((f) => !f)}
              className="bg-rose-100 text-rose-600 font-bold px-2 py-1 rounded-lg text-sm"
            >
              + Add
            </button>
          </div>
          {showWorkerForm && (
            <div className="space-y-2 mb-3 bg-rose-50 p-3 rounded-xl">
              {(["name", "phone", "village"] as const).map((k) => (
                <input
                  key={k}
                  placeholder={`${k.charAt(0).toUpperCase() + k.slice(1)} / ${k === "name" ? "పేరు" : k === "phone" ? "ఫోన్" : "గ్రామం"}`}
                  value={wForm[k]}
                  onChange={(e) =>
                    setWForm((f) => ({ ...f, [k]: e.target.value }))
                  }
                  className="w-full border border-rose-200 rounded-lg px-3 py-2 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 text-sm"
                />
              ))}
              <button
                type="button"
                onClick={addWorker}
                className="w-full bg-rose-500 text-white font-bold py-2 rounded-lg text-sm"
              >
                Add Worker
              </button>
            </div>
          )}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {workers.map((w) => (
              <div
                key={w.id}
                className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-bold text-sm text-gray-800">{w.name}</p>
                  <p className="text-xs text-gray-500">{w.phone} · {w.village}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'visits' && (
        <div className="bg-white rounded-2xl shadow-md p-4 border border-rose-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg text-rose-700">
              📅 Visit Records / సందర్శన రికార్డులు
            </h3>
            <button
              type="button"
              onClick={() => setShowVisitForm((f) => !f)}
              className="bg-rose-100 text-rose-600 font-bold px-2 py-1 rounded-lg text-sm"
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
                className="w-full border border-rose-200 rounded-lg px-3 py-2 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 text-sm"
              />
              <select
                value={vForm.ashaWorkerId}
                onChange={(e) =>
                  setVForm((f) => ({ ...f, ashaWorkerId: e.target.value }))
                }
                className="w-full border border-rose-200 rounded-lg px-3 py-2 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 bg-white text-sm"
              >
                <option value="">Select ASHA Worker</option>
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
                className="w-full border border-rose-200 rounded-lg px-3 py-2 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 text-sm"
              />
              <input
                placeholder="Notes / గమనికలు"
                value={vForm.notes}
                onChange={(e) =>
                  setVForm((f) => ({ ...f, notes: e.target.value }))
                }
                className="w-full border border-rose-200 rounded-lg px-3 py-2 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 text-sm"
              />
              <button
                type="button"
                onClick={addVisit}
                className="w-full bg-rose-500 text-white font-bold py-2 rounded-lg text-sm"
              >
                Schedule Visit
              </button>
            </div>
          )}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {visits.map((v) => (
              <div
                key={v.id}
                className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-bold text-sm text-gray-800">{v.patientName}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(v.scheduledDate).toLocaleDateString("en-IN")} · {v.completed ? "✅ Done" : "⏳ Pending"}
                  </p>
                </div>
                {!v.completed && (
                  <button
                    type="button"
                    onClick={() => completeVisit(v.id)}
                    className="text-xs bg-green-500 text-white font-bold px-2 py-1 rounded-full"
                  >
                    Mark Done
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('workers')}
          className="bg-white rounded-2xl shadow-md p-4 border border-rose-100 hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <span className="text-3xl mb-2 block">👩‍⚕️</span>
            <span className="font-bold text-sm text-rose-700">Add Worker</span>
            <span className="text-xs text-gray-500 block">వర్కర్ జోడించు</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setShowVisitForm(true)}
          className="bg-white rounded-2xl shadow-md p-4 border border-rose-100 hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <span className="text-3xl mb-2 block">📅</span>
            <span className="font-bold text-sm text-rose-700">Schedule Visit</span>
            <span className="text-xs text-gray-500 block">సందర్శన షెడ్యూల్</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('symptoms')}
          className="bg-white rounded-2xl shadow-md p-4 border border-rose-100 hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <span className="text-3xl mb-2 block">🚨</span>
            <span className="font-bold text-sm text-rose-700">View Symptoms</span>
            <span className="text-xs text-gray-500 block">లక్షణాలు చూడు</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('visits')}
          className="bg-white rounded-2xl shadow-md p-4 border border-rose-100 hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <span className="text-3xl mb-2 block">📊</span>
            <span className="font-bold text-sm text-rose-700">Visit Reports</span>
            <span className="text-xs text-gray-500 block">సందర్శన నివేదికలు</span>
          </div>
        </button>
      </div>


    </div>
  );
}

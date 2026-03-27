import { useState, useEffect } from "react";
import { store } from "../store";
import type { ASHAWorker, VisitRecord } from "../types";

interface Patient {
  _id: string;
  name: string;
  phone: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  trimester: number;
  language: string;
}

export default function AshaVisitsPage() {
  const [workers] = useState<ASHAWorker[]>(() => store.getASHA());
  const [visits, setVisits] = useState<VisitRecord[]>(() => store.getVisits());
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [vForm, setVForm] = useState({
    patientName: "",
    ashaWorkerId: "",
    scheduledDate: "",
    notes: "",
  });

  useEffect(() => {
    fetch('/api/asha/patients')
      .then(res => res.json())
      .then(data => setPatients(data))
      .catch(err => console.error('Failed to fetch patients:', err));
  }, []);

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
    <div className="p-4 pb-24 space-y-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-md p-4 border border-rose-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl text-rose-700">
            📅 Visit Records
          </h2>
          <button
            type="button"
            onClick={() => setShowVisitForm((f) => !f)}
            className="bg-rose-500 text-white font-bold px-3 py-1.5 rounded-lg text-sm shadow-sm"
          >
            + Schedule
          </button>
        </div>
        
        {showVisitForm && (
          <div className="space-y-3 mb-4 bg-rose-50 p-4 rounded-xl border border-rose-100">
            <select
              value={vForm.patientName}
              onChange={(e) =>
                setVForm((f) => ({ ...f, patientName: e.target.value }))
              }
              className="w-full border border-rose-200 rounded-lg px-3 py-2 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 bg-white"
            >
              <option value="">Select Patient / రోగిని ఎంచుకోండి</option>
              {patients.map((p) => (
                <option key={p._id} value={p.name}>
                  {p.name} (Trimester {p.trimester}, {p.risk_level} Risk)
                </option>
              ))}
            </select>
            <select
              value={vForm.ashaWorkerId}
              onChange={(e) =>
                setVForm((f) => ({ ...f, ashaWorkerId: e.target.value }))
              }
              className="w-full border border-rose-200 rounded-lg px-3 py-2 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 bg-white"
            >
              <option value="">Select Assignee (ASHA/Doctor)</option>
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
              className="w-full border border-rose-200 rounded-lg px-3 py-2 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
            />
            <input
              placeholder="Notes / గమనికలు (e.g. Bring files)"
              value={vForm.notes}
              onChange={(e) =>
                setVForm((f) => ({ ...f, notes: e.target.value }))
              }
              className="w-full border border-rose-200 rounded-lg px-3 py-2 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
            />
            <button
              type="button"
              onClick={addVisit}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-lg shadow-sm transition-colors"
            >
              Save Schedule
            </button>
          </div>
        )}
        
        {visits.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-6">
            No visits scheduled yet.
          </p>
        )}
        
        <div className="space-y-3">
          {visits.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between p-3 border border-gray-100 bg-gray-50 rounded-xl"
            >
              <div>
                <p className="font-bold text-gray-800 text-sm mb-0.5">{v.patientName}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                   <span className="font-semibold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">{new Date(v.scheduledDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric'})}</span>
                   <span>•</span>
                   <span>Assigned ID: {v.ashaWorkerId || 'Unassigned'}</span>
                </div>
                <p className="text-xs text-gray-600 italic">📝 {v.notes || "No additional notes"}</p>
              </div>
              {v.completed ? (
                <span className="text-xs bg-green-100 text-green-700 font-bold px-3 py-1.5 rounded-full border border-green-200">
                  ✅ Done
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => completeVisit(v.id)}
                  className="text-xs bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 font-bold px-3 py-1.5 rounded-full shadow-sm transition-colors"
                >
                  Mark Done
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4 border border-rose-100">
        <h2 className="font-bold text-xl text-rose-700 mb-4">
          👥 Assigned Patients
        </h2>
        
        {patients.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-6">
            Loading patients...
          </p>
        )}
        
        <div className="space-y-3">
          {patients.map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between p-3 border border-gray-100 bg-gray-50 rounded-xl"
            >
              <div>
                <p className="font-bold text-gray-800 text-sm mb-0.5">{p.name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <span className="font-semibold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">{p.risk_level} Risk</span>
                  <span>•</span>
                  <span>Trimester {p.trimester}</span>
                  <span>•</span>
                  <span>{p.phone}</span>
                </div>
                <p className="text-xs text-gray-600">Language: {p.language}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setVForm({ ...vForm, patientName: p.name });
                  setShowVisitForm(true);
                }}
                className="text-xs bg-rose-500 text-white font-bold px-3 py-1.5 rounded-full shadow-sm"
              >
                Schedule Visit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

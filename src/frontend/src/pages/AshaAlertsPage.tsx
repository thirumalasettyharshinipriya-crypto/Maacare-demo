import { useState, useEffect } from "react";
import { store } from "../store";

interface Patient {
  _id: string;
  name: string;
  phone: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  trimester: number;
  language: string;
}

export default function AshaAlertsPage() {
  const [alerts, setAlerts] = useState(() => {
    const existing = store.getAlerts();
    if (existing.length === 0) {
      const mocks = [
        { id: 'a1', timestamp: new Date().toISOString(), patientId: 'Priya Sharma', type: 'sos', resolved: false },
        { id: 'a2', timestamp: new Date(Date.now() - 3600000).toISOString(), patientId: 'Amina Kumar', type: 'critical_symptom', resolved: true },
        { id: 'a3', timestamp: new Date(Date.now() - 7200000).toISOString(), patientId: 'Sneha Patel', type: 'sos', resolved: false }
      ] as any;
      store.saveAlerts(mocks);
      return mocks;
    }
    return existing;
  });
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    fetch('/api/asha/patients')
      .then(res => res.json())
      .then(data => setPatients(data))
      .catch(err => console.error('Failed to fetch patients:', err));
  }, []);

  function resolveAlert(id: string) {
    const updated = alerts.map((a: any) => a.id === id ? { ...a, resolved: true } : a);
    setAlerts(updated);
    store.saveAlerts(updated);
  }

  const unresolvedCount = alerts.filter((a: any) => !a.resolved).length;

  return (
    <div className="p-4 pb-24 space-y-4 animate-in fade-in">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-black text-red-600 flex items-center gap-2">
          🚨 Active Alerts
        </h2>
        {unresolvedCount > 0 && (
          <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
            {unresolvedCount} Pending
          </span>
        )}
      </div>

      <div className="space-y-4">
        {alerts.length === 0 && (
          <p className="text-gray-400 text-center py-8 bg-gray-50 rounded-2xl border border-gray-100">No alerts triggered yet. System is quiet.</p>
        )}
        
        {alerts.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((a: any) => (
          <div key={a.id} className={`p-4 rounded-2xl shadow-sm border-l-8 ${a.resolved ? 'bg-white border-gray-300 opacity-60' : 'bg-red-50 border-red-500 relative overflow-hidden'}`}>
            {!a.resolved && (
               <div className="absolute top-0 right-0 p-4 bg-red-200 blur-2xl rounded-full opacity-50 w-24 h-24 transform translate-x-10 -translate-y-10"></div>
            )}
            
            <div className="flex justify-between items-start mb-3 relative z-10">
              <span className={`font-black uppercase tracking-wider text-xs px-2 py-1 rounded-sm ${a.resolved ? 'bg-gray-100 text-gray-500' : 'bg-red-200 text-red-800'}`}>
                {a.type === 'sos' ? 'SOS EMERGENCY' : 'CRITICAL SYMPTOM'}
              </span>
              <span className="text-xs font-semibold text-gray-400">
                {new Date(a.timestamp).toLocaleString("en-IN", { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
              </span>
            </div>
            
            <p className="font-bold text-gray-800 mb-4 relative z-10">
              Patient: <span className="text-xl ml-1">{a.patientId}</span>
            </p>
            
            {!a.resolved ? (
               <button 
                 onClick={() => resolveAlert(a.id)} 
                 className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md transition-colors relative z-10"
               >
                 Acknowledge & Mark Resolved
               </button>
            ) : (
               <div className="flex items-center gap-2 justify-center w-full bg-gray-50 border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm font-bold">
                 <span>✅</span> Resolved
               </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4 border border-rose-100">
        <h2 className="font-bold text-xl text-rose-700 mb-4">
          👥 Patient Overview
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
                  <span className={`font-semibold px-2 py-0.5 rounded-full ${
                    p.risk_level === 'HIGH' ? 'text-red-600 bg-red-100' :
                    p.risk_level === 'MEDIUM' ? 'text-yellow-600 bg-yellow-100' :
                    'text-green-600 bg-green-100'
                  }`}>{p.risk_level} Risk</span>
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
                  // Could add alert for this patient
                  alert(`Alert created for ${p.name}`);
                }}
                className="text-xs bg-red-500 text-white font-bold px-3 py-1.5 rounded-full shadow-sm"
              >
                Create Alert
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

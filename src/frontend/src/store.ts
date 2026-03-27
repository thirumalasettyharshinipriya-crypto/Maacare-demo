import type {
  ASHAWorker,
  EmergencyAlert,
  PatientProfile,
  SymptomLog,
  VisitRecord,
} from "./types";

const KEYS = {
  patient: "pg_patient",
  symptoms: "pg_symptoms",
  alerts: "pg_alerts",
  asha: "pg_asha",
  visits: "pg_visits",
};

function get<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}

function set<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const store = {
  getPatient: () => get<PatientProfile>(KEYS.patient),
  savePatient: (p: PatientProfile) => set(KEYS.patient, p),

  getSymptoms: () => get<SymptomLog[]>(KEYS.symptoms) ?? [
    { id: '1', timestamp: new Date(Date.now() - 86400000).toISOString(), symptoms: ['Mild Nausea', 'Fatigue'], riskLevel: 'low', aiSuggestion: 'Stay hydrated and rest. Try eating small, frequent meals.', voiceInputUsed: false, language: 'en' },
    { id: '2', timestamp: new Date(Date.now() - 172800000).toISOString(), symptoms: ['Swelling in legs'], riskLevel: 'medium', aiSuggestion: 'Elevate your legs when sitting and avoid standing for long periods. If severe, consult your clinic.', voiceInputUsed: false, language: 'en' }
  ],
  saveSymptoms: (s: SymptomLog[]) => set(KEYS.symptoms, s),
  addSymptom: (s: SymptomLog) => {
    const all = store.getSymptoms();
    all.unshift(s);
    store.saveSymptoms(all);
  },

  getAlerts: () => get<EmergencyAlert[]>(KEYS.alerts) ?? [],
  saveAlerts: (a: EmergencyAlert[]) => set(KEYS.alerts, a),
  addAlert: (a: EmergencyAlert) => {
    const all = store.getAlerts();
    all.unshift(a);
    store.saveAlerts(all);
  },

  getASHA: () => get<ASHAWorker[]>(KEYS.asha) ?? [
    { id: 'w1', name: 'Nurse Anjali', phone: '+91 9123456789', village: 'Mysuru North' },
    { id: 'w2', name: 'Dr. Ramesh (Clinic)', phone: '+91 9988776655', village: 'Mysuru General' }
  ],
  saveASHA: (a: ASHAWorker[]) => set(KEYS.asha, a),

  getVisits: () => get<VisitRecord[]>(KEYS.visits) ?? [
    { id: 'v1', patientName: 'You (Routine Checkup)', ashaWorkerId: 'w1', scheduledDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], notes: 'Bring ultrasound reports.', completed: false },
    { id: 'v2', patientName: 'You (Vaccination)', ashaWorkerId: 'w2', scheduledDate: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0], notes: 'Tetanus shot administered.', completed: true }
  ],
  saveVisits: (v: VisitRecord[]) => set(KEYS.visits, v),
};

export function computePregnancyInfo(lmpDate: string) {
  const lmp = new Date(lmpDate).getTime();
  const now = Date.now();
  const week = Math.max(0, Math.floor((now - lmp) / (7 * 24 * 60 * 60 * 1000)));
  const edd = new Date(lmp + 280 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const trimester: 1 | 2 | 3 = week <= 13 ? 1 : week <= 26 ? 2 : 3;
  return { week, edd, trimester };
}

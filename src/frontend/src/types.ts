export type RiskLevel = "low" | "medium" | "high";
export type Language = "en" | "hi" | "te";
export type Trimester = 1 | 2 | 3;

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  village: string;
  phone: string;
  lmpDate: string;
  edd: string;
  trimester: Trimester;
  pregnancyWeek: number;
  emergencyContacts: EmergencyContact[];
  ashaWorkerName: string;
  ashaWorkerPhone: string;
}

export interface SymptomLog {
  id: string;
  timestamp: string;
  symptoms: string[];
  riskLevel: RiskLevel;
  aiSuggestion: string;
  voiceInputUsed: boolean;
  language: Language;
}

export interface EmergencyAlert {
  id: string;
  timestamp: string;
  contactsNotified: string[];
  conditionSummary: string;
  locationPlaceholder: string;
  status: "sent" | "acknowledged";
}

export interface ASHAWorker {
  id: string;
  name: string;
  phone: string;
  village: string;
}

export interface VisitRecord {
  id: string;
  patientName: string;
  ashaWorkerId: string;
  scheduledDate: string;
  completed: boolean;
  notes: string;
}

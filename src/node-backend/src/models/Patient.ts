import mongoose, { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
  userId: string;
  name: string;
  phone: string;
  role: 'PATIENT' | 'ASHA' | 'DOCTOR';
  language: string;
  trimester: number;
  dietary_avoidances: string[];
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  ashaWorkerId?: string;
  passwordHash: string;
}

const PatientSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ['PATIENT', 'ASHA', 'DOCTOR'], default: 'PATIENT' },
  language: { type: String, default: 'en' },
  trimester: { type: Number, default: 1 },
  dietary_avoidances: [{ type: String }],
  risk_level: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
  ashaWorkerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }, // Ref to another user
  passwordHash: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IPatient>('Patient', PatientSchema);

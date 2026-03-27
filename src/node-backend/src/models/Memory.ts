import mongoose, { Schema, Document } from 'mongoose';

export interface IMemory extends Document {
  patientId: mongoose.Types.ObjectId;
  messages: {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
  }[];
}

const MemorySchema: Schema = new Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, unique: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model<IMemory>('Memory', MemorySchema);

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Patient from '../models/Patient';

export const sendSMSAlert = async (req: Request, res: Response) => {
  try {
    const { patientId, message } = req.body;
    
    if (mongoose.connection.readyState === 1) {
      const patient = await Patient.findById(patientId).populate('ashaWorkerId');
      if (!patient) return res.status(404).json({ message: 'Patient not found' });
      console.log(`[MOCK SMS] Sent to ASHA worker for patient ${patient.name}: ${message}`);
    } else {
      console.log(`[MOCK SMS] Sent to ASHA worker for patient ${patientId}: ${message} (DB Disconnected)`);
    }

    res.json({ success: true, message: 'SMS Alert dispatched successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

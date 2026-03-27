import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Patient from '../models/Patient';

export const getPatients = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      // Mock mode
      return res.json([
        { _id: '1', name: 'Amina Kumar', phone: '+91 9876543210', risk_level: 'HIGH', trimester: 3, language: 'en' },
        { _id: '2', name: 'Priya Sharma', phone: '+91 8765432109', risk_level: 'MEDIUM', trimester: 2, language: 'hi' },
        { _id: '3', name: 'Lakshmi Reddy', phone: '+91 7654321098', risk_level: 'LOW', trimester: 1, language: 'te' },
        { _id: '4', name: 'Sneha Patel', phone: '+91 6543210987', risk_level: 'HIGH', trimester: 3, language: 'en' },
        { _id: '5', name: 'Kavita Das', phone: '+91 5432109876', risk_level: 'MEDIUM', trimester: 2, language: 'hi' },
        { _id: '6', name: 'Meena Iyer', phone: '+91 4321098765', risk_level: 'LOW', trimester: 1, language: 'en' },
        { _id: '7', name: 'Anita Roy', phone: '+91 3210987654', risk_level: 'MEDIUM', trimester: 3, language: 'te' }
      ]);
    }

    // Ideally filter by req.user.id (ASHA worker) if auth middleware applied
    const patients = await Patient.find({ role: 'PATIENT' }).sort({ risk_level: -1 });
    res.json(patients);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePatientRisk = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { risk_level } = req.body;
    
    if (mongoose.connection.readyState !== 1) {
      // Mock mode
      return res.json({ _id: id, risk_level, name: 'Mock Patient Updated' });
    }

    const patient = await Patient.findByIdAndUpdate(id, { risk_level }, { new: true });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    
    res.json(patient);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

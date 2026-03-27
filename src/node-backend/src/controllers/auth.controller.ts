import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Patient from '../models/Patient';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, phone, password, role, language, trimester, dietary_avoidances, risk_level } = req.body;

    if (mongoose.connection.readyState !== 1) {
      // Mock mode
      return res.status(201).json({
        _id: 'mock_user_id',
        name,
        phone,
        role: role || 'PATIENT',
        language: language || 'en',
        token: generateToken('mock_user_id', role || 'PATIENT'),
      });
    }

    const userExists = await Patient.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await Patient.create({
      name,
      phone,
      passwordHash,
      role: role || 'PATIENT',
      language,
      trimester,
      dietary_avoidances,
      risk_level
    });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { phone, password, role } = req.body;

    if (mongoose.connection.readyState !== 1) {
      // Mock mode
      const selectedRole = role || 'PATIENT';
      return res.json({
        _id: 'mock_user_id',
        name: 'Mock User',
        phone,
        role: selectedRole,
        language: 'en',
        token: generateToken('mock_user_id', selectedRole),
      });
    }

    const user = await Patient.findOne({ phone });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      res.json({
        _id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        language: user.language,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid phone number or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

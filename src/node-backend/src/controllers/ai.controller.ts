import { Request, Response } from 'express';
import OpenAI from 'openai';
import mongoose from 'mongoose';
import Memory from '../models/Memory';
import Patient from '../models/Patient';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-mock-key',
});

// Middleware for auth can be injected in routes to populate req.user
export const handleChat = async (req: Request, res: Response) => {
  try {
    const { patientId, message, language } = req.body;
    
    if (mongoose.connection.readyState !== 1) {
      // Mock mode
      const isCritical = message.toLowerCase().includes('pain') || 
                         message.toLowerCase().includes('bleeding') || 
                         message.toLowerCase().includes('swelling') || 
                         message.toLowerCase().includes('fever');
      return res.json({ 
        reply: isCritical ? "⚠️ [CRITICAL_RISK] This sounds serious. I am alerting your doctor and ASHA worker immediately. Please contact the clinic!" : "I am a mock AI companion (DB disconnected). I am here for you!", 
        riskDetected: isCritical 
      });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    let memory = await Memory.findOne({ patientId });
    if (!memory) {
      memory = new Memory({ patientId, messages: [] });
    }

    const systemPrompt = `You are a caring maternal health companion. 
    The patient prefers to speak in ${language || patient.language}. 
    Speak simply, compassionately, and ask ONE question at a time.
    The patient avoids: ${patient.dietary_avoidances.join(', ')}. NEVER recommend these.
    If the patient mentions extreme pain, bleeding, or no fetal movement, output [CRITICAL_RISK] directly in your response text.`;

    const recentMessages = memory.messages.slice(-10).map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));

    const messagesToSent: any[] = [
      { role: 'system', content: systemPrompt },
      ...recentMessages,
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messagesToSent,
      max_tokens: 150,
      temperature: 0.7
    });

    const aiResponse = response.choices[0].message?.content || 'I am here for you.';

    let riskDetected = false;
    let cleanResponse = aiResponse;

    if (aiResponse.includes('[CRITICAL_RISK]')) {
      riskDetected = true;
      cleanResponse = aiResponse.replace('[CRITICAL_RISK]', '').trim();
      patient.risk_level = 'HIGH';
      await patient.save();
    }

    memory.messages.push({ role: 'user', content: message, timestamp: new Date() });
    memory.messages.push({ role: 'assistant', content: cleanResponse, timestamp: new Date() });
    await memory.save();

    res.json({ reply: cleanResponse, riskDetected });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

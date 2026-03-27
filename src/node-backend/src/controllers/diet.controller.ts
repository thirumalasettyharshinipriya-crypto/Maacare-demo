import { Request, Response } from 'express';
import OpenAI from 'openai';
import mongoose from 'mongoose';
import Patient from '../models/Patient';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-mock-key',
});

export const getDietPlan = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    
    let trimester = 1;
    let avoidances = 'None';
    let language = 'en';

    if (mongoose.connection.readyState === 1) {
      const patient = await Patient.findById(patientId);
      if (patient) {
        trimester = patient.trimester;
        avoidances = patient.dietary_avoidances.length > 0 ? patient.dietary_avoidances.join(', ') : 'None';
        language = patient.language;
      }
    }

    const systemPrompt = `You are a maternal nutrition expert. 
    The patient is in Trimester ${trimester}.
    They MUST AVOID eating: ${avoidances}.
    Provide a personalized, safe, and healthy 1-day diet plan including Breakfast, Lunch, and Dinner. 
    Translate the output to the patient's language: ${language}.
    Return the output in the following JSON structure exactly:
    {
      "breakfast": "...",
      "lunch": "...",
      "dinner": "...",
      "tip": "..."
    }`;

    // For demonstration, if no real API key is provided, return a mock response
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-mock-key') {
      return res.json({
        breakfast: "Oats with fruits (Mock - Add OpenAI key)",
        lunch: "Lentil soup and rice (Mock - Add OpenAI key)",
        dinner: "Grilled chicken or paneer with veggies (Mock - Add OpenAI key)",
        tip: "Drink 8 glasses of water!"
      });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 300,
      temperature: 0.7
    });

    const aiResponse = JSON.parse(response.choices[0].message?.content || '{}');
    
    res.json(aiResponse);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

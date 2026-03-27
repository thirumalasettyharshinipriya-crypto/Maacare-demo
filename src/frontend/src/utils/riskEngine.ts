import type { Language, RiskLevel } from "../types";

const HIGH = [
  "bleeding",
  "blood",
  "severe pain",
  "no movement",
  "seizure",
  "fits",
  "unconscious",
  "faint",
  "high fever",
  "severe headache",
  "blurred vision",
  "chest pain",
  "breathe",
  "breathing",
  "khoon",
  "zyada dard",
  "behosh",
  "daure",
  "रक्तस्राव",
  "तेज दर्द",
  "दौरे",
  "బాధ",
  "రక్తస్రావం",
];
const MEDIUM = [
  "mild pain",
  "swelling",
  "nausea",
  "vomiting",
  "backache",
  "leg cramp",
  "reduced movement",
  "dizziness",
  "fatigue",
  "discharge",
  "ulti",
  "chakkar",
  "sujan",
  "kamar dard",
  "उल्टी",
  "चक्कर",
  "सूजन",
  "కడుపు నొప్పి",
  "వికారం",
];

export interface RiskResult {
  riskLevel: RiskLevel;
  suggestion: string;
  hindiSuggestion: string;
  teluguSuggestion: string;
}

export function analyzeRisk(text: string): RiskResult {
  const lower = text.toLowerCase();
  const isHigh = HIGH.some((k) => lower.includes(k));
  const isMed = MEDIUM.some((k) => lower.includes(k));

  if (isHigh)
    return {
      riskLevel: "high",
      suggestion:
        "⚠️ URGENT: Go to hospital immediately! Call emergency contacts now.",
      hindiSuggestion: "⚠️ तुरंत अस्पताल जाएं! अभी आपातकालीन संपर्कों को कॉल करें।",
      teluguSuggestion:
        "⚠️ వెంటనే ఆసుపత్రికి వెళ్ళండి! ఇప్పుడే అత్యవసర సంప్రదింపులకు కాల్ చేయండి।",
    };
  if (isMed)
    return {
      riskLevel: "medium",
      suggestion:
        "⚕️ Monitor closely. Rest, drink water, consult your ASHA worker or nearest clinic today.",
      hindiSuggestion:
        "⚕️ ध्यान से देखें। आराम करें, पानी पिएं, आज अपने ASHA कार्यकर्ता से मिलें।",
      teluguSuggestion:
        "⚕️ జాగ్రత్తగా పర్యవేక్షించండి. విశ్రాంతి తీసుకోండి, నీరు తాగండి, ఈరోజు ASHA వర్కర్‌ని సంప్రదించండి।",
    };
  return {
    riskLevel: "low",
    suggestion:
      "✅ This appears normal. Rest well, stay hydrated, and continue regular check-ups.",
    hindiSuggestion:
      "✅ यह सामान्य लगता है। अच्छे से आराम करें, पानी पिएं, और नियमित जांच जारी रखें।",
    teluguSuggestion: "✅ ఇది సాధారణంగా కనిపిస్తోంది. బాగా విశ్రాంతి తీసుకోండి, నీరు తాగండి.",
  };
}

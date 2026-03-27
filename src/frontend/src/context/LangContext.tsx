import { createContext, useContext, useState } from "react";

export const LANGS = {
  en: {
    symptoms: "Symptoms",
    logSymptoms: "Log Symptoms",
    diet: "Diet",
    exercise: "Exercise",
    tools: "Tools",
    dashboard: "Dashboard",
    alerts: "Alerts",
    home: "Home",
    voice: "Voice",
    risk: "Risk Level",
    suggestion: "Suggestion",
    save: "Save",
    sos: "SOS Alert",
    hospitals: "Hospitals",
    nearbyHospitals: "Nearby Hospitals",
    getDirections: "Get Directions",
    findingLocation: "Finding your location...",
    progress: "Progress",
  },
  hi: {
    symptoms: "लक्षण",
    logSymptoms: "लक्षण दर्ज करें",
    diet: "आहार",
    exercise: "व्यायाम",
    tools: "उपकरण",
    dashboard: "डैशबोर्ड",
    alerts: "अलर्ट",
    home: "होम",
    voice: "आवाज",
    risk: "जोखिम स्तर",
    suggestion: "सुझाव",
    save: "सहेजें",
    sos: "SOS अलर्ट",
    hospitals: "अस्पताल",
    nearbyHospitals: "नजदीकी अस्पताल",
    getDirections: "रास्ता पाओ",
    findingLocation: "स्थान खोज रहे हैं...",
    progress: "प्रगति",
  },
  te: {
    symptoms: "లక్షణాలు",
    logSymptoms: "లక్షణాలు నమోదు చేయండి",
    diet: "ఆహారం",
    exercise: "వ్యాయామం",
    tools: "సాధనాలు",
    dashboard: "డాష్‌బోర్డ్",
    alerts: "హెచ్చరికలు",
    home: "హోమ్",
    voice: "వాయిస్",
    risk: "ప్రమాద స్థాయి",
    suggestion: "సూచన",
    save: "సేవ్",
    sos: "SOS హెచ్చరిక",
    hospitals: "ఆసుపత్రులు",
    nearbyHospitals: "సమీప ఆసుపత్రులు",
    getDirections: "దారి చూపించు",
    findingLocation: "మీ స్థానం కనుగొంటున్నాం...",
    progress: "పురోగతి",
  },
  ta: {
    symptoms: "அறிகுறிகள்",
    logSymptoms: "அறிகுறிகளை பதிவு செய்க",
    diet: "உணவு",
    exercise: "உடற்பயிற்சி",
    tools: "கருவிகள்",
    dashboard: "டாஷ்போர்டு",
    alerts: "எச்சரிக்கைகள்",
    home: "முகப்பு",
    voice: "குரல்",
    risk: "ஆபத்து நிலை",
    suggestion: "பரிந்துரை",
    save: "சேமி",
    sos: "SOS எச்சரிக்கை",
    hospitals: "மருத்துவமனை",
    nearbyHospitals: "அருகிலுள்ள மருத்துவமனைகள்",
    getDirections: "வழி காட்டு",
    findingLocation: "உங்கள் இடத்தை கண்டறிகிறோம்...",
    progress: "முன்னேற்றம்",
  },
  kn: {
    symptoms: "ರೋಗಲಕ್ಷಣಗಳು",
    logSymptoms: "ರೋಗಲಕ್ಷಣ ದಾಖಲಿಸಿ",
    diet: "ಆಹಾರ",
    exercise: "ವ್ಯಾಯಾಮ",
    tools: "ಸಾಧನಗಳು",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    alerts: "ಎಚ್ಚರಿಕೆಗಳು",
    home: "ಮನೆ",
    voice: "ಧ್ವನಿ",
    risk: "ಅಪಾಯ ಮಟ್ಟ",
    suggestion: "ಸಲಹೆ",
    save: "ಉಳಿಸಿ",
    sos: "SOS ಎಚ್ಚರಿಕೆ",
    hospitals: "ಆಸ್ಪತ್ರೆ",
    nearbyHospitals: "ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು",
    getDirections: "ದಾರಿ ತೋರಿಸಿ",
    findingLocation: "ನಿಮ್ಮ ಸ್ಥಳ ಹುಡುಕುತ್ತಿದ್ದೇವೆ...",
    progress: "ಪ್ರಗತಿ",
  },
  mr: {
    symptoms: "लक्षणे",
    logSymptoms: "लक्षणे नोंदवा",
    diet: "आहार",
    exercise: "व्यायाम",
    tools: "साधने",
    dashboard: "डॅशबोर्ड",
    alerts: "सूचना",
    home: "होम",
    voice: "आवाज",
    risk: "धोका पातळी",
    suggestion: "सूचना",
    save: "जतन करा",
    sos: "SOS सूचना",
    hospitals: "रुग्णालय",
    nearbyHospitals: "जवळचे रुग्णालय",
    getDirections: "मार्ग दाखवा",
    findingLocation: "स्थान शोधत आहे...",
    progress: "प्रगती",
  },
  bn: {
    symptoms: "উপসর্গ",
    logSymptoms: "উপসর্গ নথিভুক্ত করুন",
    diet: "খাদ্য",
    exercise: "ব্যায়াম",
    tools: "সরঞ্জাম",
    dashboard: "ড্যাশবোর্ড",
    alerts: "সতর্কতা",
    home: "হোম",
    voice: "ভয়েস",
    risk: "ঝুঁকি স্তর",
    suggestion: "পরামর্শ",
    save: "সংরক্ষণ",
    sos: "SOS সতর্কতা",
    hospitals: "হাসপাতাল",
    nearbyHospitals: "কাছের হাসপাতাল",
    getDirections: "পথ দেখাও",
    findingLocation: "আপনার অবস্থান খুঁজছি...",
    progress: "অগ্রগতি",
  },
};

export type LangKey = keyof typeof LANGS;

export interface LangContextValue {
  lang: LangKey;
  setLang: (l: LangKey) => void;
  t: (typeof LANGS)[LangKey];
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
  t: LANGS.en,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const stored = (localStorage.getItem("pg_lang") ?? "en") as LangKey;
  const [lang, setLangState] = useState<LangKey>(stored);

  function setLang(l: LangKey) {
    setLangState(l);
    localStorage.setItem("pg_lang", l);
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t: LANGS[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

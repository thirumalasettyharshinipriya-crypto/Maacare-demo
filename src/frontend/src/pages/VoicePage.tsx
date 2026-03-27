import { useRef, useState } from "react";
import RiskBadge from "../components/RiskBadge";
import { store } from "../store";
import type { Language, SymptomLog } from "../types";
import { analyzeRisk } from "../utils/riskEngine";

const langMap: Record<Language, string> = {
  en: "en-US",
  hi: "hi-IN",
  te: "te-IN",
};
const langLabel: Record<Language, string> = {
  en: "English",
  hi: "हिंदी",
  te: "తెలుగు",
};

type AnySpeechRecognition = any;

export default function VoicePage() {
  const [lang, setLang] = useState<Language>("te");
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [risk, setRisk] = useState<ReturnType<typeof analyzeRisk> | null>(null);
  const [saved, setSaved] = useState(false);
  const w = window as unknown as Record<string, unknown>;
  const [supported] = useState(
    () => !!(w.SpeechRecognition || w.webkitSpeechRecognition),
  );
  const recRef = useRef<AnySpeechRecognition>(null);

  function startListening() {
    const SR = (w.SpeechRecognition ||
      w.webkitSpeechRecognition) as new () => AnySpeechRecognition;
    const rec = new SR();
    rec.lang = langMap[lang];
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e: AnySpeechRecognition) => {
      const t = Array.from(e.results as unknown[])
        .map((r: unknown) => (r as AnySpeechRecognition)[0].transcript)
        .join(" ");
      setTranscript(t);
    };
    rec.onend = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
    setRisk(null);
    setSaved(false);
  }

  function stopListening() {
    recRef.current?.stop();
    setListening(false);
  }

  function analyze(text: string) {
    const r = analyzeRisk(text);
    setRisk(r);
    speak(r);
  }

  function speak(r: ReturnType<typeof analyzeRisk>) {
    const msg =
      lang === "hi"
        ? r.hindiSuggestion
        : lang === "te"
          ? r.teluguSuggestion
          : r.suggestion;
    const utt = new SpeechSynthesisUtterance(msg);
    utt.lang = langMap[lang];
    window.speechSynthesis.speak(utt);
  }

  function saveLog() {
    if (!risk || !transcript) return;
    const log: SymptomLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      symptoms: [transcript.slice(0, 100)],
      riskLevel: risk.riskLevel,
      aiSuggestion: risk.suggestion,
      voiceInputUsed: true,
      language: lang,
    };
    store.addSymptom(log);
    setSaved(true);
  }

  const tapLabel =
    lang === "te"
      ? "నొక్కి మాట్లాడండి"
      : lang === "hi"
        ? "बोलने के लिए दबाएं"
        : "Tap to Speak";
  const stopLabel = lang === "te" ? "ఆపండి" : lang === "hi" ? "रोकें" : "Stop";
  const wordsLabel =
    lang === "te" ? "మీ మాటలు" : lang === "hi" ? "आपके शब्द" : "Your words";
  const placeholder =
    lang === "te"
      ? "వాయిస్ ఇక్కడ కనిపిస్తుంది... లేదా టైప్ చేయండి"
      : lang === "hi"
        ? "आवाज़ यहाँ दिखेगी... या टाइप करें"
        : "Voice will appear here... or type manually";
  const analyzeLabel =
    lang === "te" ? "విశ్లేషించండి →" : lang === "hi" ? "विश्लेषण करें →" : "Analyze →";
  const disclaimerLabel =
    lang === "te"
      ? "ఇది డాక్టర్‌కు ప్రత్యామ్నాయం కాదు."
      : lang === "hi"
        ? "यह डॉक्टर का विकल्प नहीं है।"
        : "This is not a replacement for a doctor.";
  const speakAgainLabel =
    lang === "te" ? "మళ్ళీ చదవండి" : lang === "hi" ? "फिर सुनें" : "Speak Again";
  const saveLabel =
    lang === "te" ? "లాగ్ సేవ్ చేయండి" : lang === "hi" ? "लॉग सेव करें" : "Save Log";
  const savedLabel =
    lang === "te" ? "సేవ్ అయింది!" : lang === "hi" ? "सेव हो गया!" : "Saved!";

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-rose-700">
        🎤 Voice Input / आवाज़ इनपुट / వాయిస్ ఇన్‌పుట్
      </h2>

      <div className="flex gap-2">
        {(["en", "hi", "te"] as Language[]).map((l) => (
          <button
            type="button"
            key={l}
            onClick={() => setLang(l)}
            className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 ${
              lang === l
                ? "bg-rose-500 text-white border-rose-500"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {langLabel[l]}
          </button>
        ))}
      </div>

      {!supported && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 text-center">
          <p className="font-semibold text-yellow-800">
            Voice not supported in this browser.
          </p>
          <p className="text-sm text-yellow-700">
            Try Chrome on Android. You can type below instead.
          </p>
        </div>
      )}

      {supported && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={listening ? stopListening : startListening}
            className={`w-40 h-40 rounded-full font-bold text-white text-4xl shadow-xl flex flex-col items-center justify-center transition-all ${
              listening
                ? "bg-red-600 scale-110 animate-pulse"
                : "bg-rose-500 hover:bg-rose-600"
            }`}
          >
            {listening ? "⏹" : "🎤"}
            <span className="text-xs mt-1">
              {listening
                ? lang === "te"
                  ? "Stop"
                  : "Stop"
                : lang === "te"
                  ? "Tap"
                  : "Tap to Speak"}
            </span>
            <span className="text-[10px]">
              {listening ? stopLabel : tapLabel}
            </span>
          </button>
        </div>
      )}

      <div>
        <p className="text-sm font-semibold text-gray-600 mb-1">
          {wordsLabel} {lang !== "te" && lang !== "hi" ? "" : "/ Your words"}
        </p>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className="w-full border-2 border-rose-200 rounded-xl px-4 py-3 text-lg focus:border-rose-400 outline-none"
        />
        {transcript && !risk && (
          <button
            type="button"
            onClick={() => analyze(transcript)}
            className="mt-2 w-full bg-rose-500 text-white font-bold py-3 rounded-xl"
          >
            {analyzeLabel}
          </button>
        )}
      </div>

      {risk && (
        <div
          className={`p-4 rounded-2xl border-2 space-y-2 ${
            risk.riskLevel === "high"
              ? "bg-red-50 border-red-400"
              : risk.riskLevel === "medium"
                ? "bg-yellow-50 border-yellow-400"
                : "bg-green-50 border-green-400"
          }`}
        >
          <RiskBadge level={risk.riskLevel} />
          <p className="font-semibold text-gray-800">
            {lang === "hi"
              ? risk.hindiSuggestion
              : lang === "te"
                ? risk.teluguSuggestion
                : risk.suggestion}
          </p>
          <p className="text-xs text-gray-500 italic">{disclaimerLabel}</p>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => speak(risk)}
              className="flex-1 bg-rose-100 text-rose-700 font-bold py-2 rounded-xl"
            >
              🔊 {speakAgainLabel}
            </button>
            {!saved ? (
              <button
                type="button"
                onClick={saveLog}
                className="flex-1 bg-rose-500 text-white font-bold py-2 rounded-xl"
              >
                💾 {saveLabel}
              </button>
            ) : (
              <span className="flex-1 bg-green-100 text-green-700 font-bold py-2 rounded-xl text-center">
                ✅ {savedLabel}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

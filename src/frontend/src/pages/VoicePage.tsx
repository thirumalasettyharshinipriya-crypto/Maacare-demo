import { useRef, useState } from "react";
import RiskBadge from "../components/RiskBadge";
import { store } from "../store";
import type { Language, SymptomLog } from "../types";
// Removed local riskEngine import

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
  const [reply, setReply] = useState<string | null>(null);
  const [riskDetected, setRiskDetected] = useState(false);
  const [loading, setLoading] = useState(false);
  const w = window as unknown as Record<string, unknown>;
  const [supported] = useState(
    () => !!(w.SpeechRecognition || w.webkitSpeechRecognition),
  );
  const recRef = useRef<AnySpeechRecognition>(null);

  // For demonstration, hardcode a mock patient ID
  const MOCK_PATIENT_ID = "000000000000000000000000";

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
    rec.onend = () => {
      setListening(false);
    };
    rec.start();
    recRef.current = rec;
    setListening(true);
    setReply(null);
    setRiskDetected(false);
  }

  function stopListening() {
    recRef.current?.stop();
    setListening(false);
  }

  async function analyze(text: string) {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: MOCK_PATIENT_ID,
          message: text,
          language: langLabel[lang]
        }),
      });
      const data = await res.json();
      setReply(data.reply);
      setRiskDetected(data.riskDetected);
      speak(data.reply);
      
      // Save log automatically
      const log: SymptomLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        symptoms: [text.slice(0, 100)],
        riskLevel: data.riskDetected ? "high" : "low",
        aiSuggestion: data.reply,
        voiceInputUsed: true,
        language: lang,
      };
      store.addSymptom(log);
    } catch (err) {
      console.error(err);
      setReply("Error reaching the assistant. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function speak(msg: string) {
    const utt = new SpeechSynthesisUtterance(msg);
    utt.lang = langMap[lang];
    window.speechSynthesis.speak(utt);
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
    lang === "te" ? "పంపండి →" : lang === "hi" ? "भेजें →" : "Send →";

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-rose-700">
        🎤 AI Assistant / एआई सहायक / AI సహాయకుడు
      </h2>

      <div className="flex gap-2">
        {(["en", "hi", "te"] as Language[]).map((l) => (
          <button
            type="button"
            key={l}
            onClick={() => { setLang(l); setReply(null); setTranscript(""); }}
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
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative">
            {/* The pulsing ring when listening */}
            {listening && (
              <div className="absolute inset-0 rounded-full border-4 border-rose-400 animate-ping opacity-75"></div>
            )}
            <button
              type="button"
              onClick={listening ? stopListening : startListening}
              className={`relative z-10 w-44 h-44 rounded-full overflow-hidden shadow-2xl transition-all border-4 ${
                listening
                  ? "border-rose-500 scale-105"
                  : "border-white hover:border-rose-300"
              }`}
            >
              <img 
                src="/ai_nurse_avatar.webp" 
                alt="AI Companion Avatar" 
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=300&h=300"; }}
              />
              <div className="absolute bottom-0 w-full bg-black/40 py-1 text-center backdrop-blur-sm">
                <span className="text-white text-xs font-bold tracking-wide">
                  {listening ? stopLabel : tapLabel}
                </span>
              </div>
            </button>
          </div>
          
          <p className="mt-4 text-center font-medium text-rose-700 max-w-[250px]">
            {listening 
              ? (lang === 'te' ? 'నేను వింటున్నాను...' : lang === 'hi' ? 'मैं सुन रही हूँ...' : 'I am listening...')
              : (lang === 'te' ? 'మాట్లాడేందుకు నా పై నొక్కండి' : lang === 'hi' ? 'मुझसे बात करने के लिए टैप करें' : 'Tap on me to speak')}
          </p>
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
        {transcript && !reply && (
          <button
            type="button"
            onClick={() => analyze(transcript)}
            disabled={loading}
            className="mt-2 w-full bg-rose-500 text-white font-bold py-3 rounded-xl disabled:bg-rose-300"
          >
            {loading ? "Thinking..." : analyzeLabel}
          </button>
        )}
      </div>

      {reply && (
        <div className="flex gap-3 mb-6 animate-in slide-in-from-bottom-5">
           <img 
              src="/ai_nurse_avatar.webp" 
              alt="Avatar" 
              className="w-10 h-10 rounded-full object-cover shadow border border-rose-200"
              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=300&h=300"; }}
            />
          <div
            className={`p-4 rounded-2xl rounded-tl-sm shadow-sm space-y-2 flex-1 ${
              riskDetected
                ? "bg-red-50 border border-red-200 text-red-900"
                : "bg-rose-50 border border-rose-100 text-gray-800"
            }`}
          >
            {riskDetected && <RiskBadge level="high" />}
            <p className="font-semibold text-[15px] leading-relaxed">
              {reply}
            </p>
            <div className="flex gap-2 pt-2 border-t border-rose-200/50">
              <button
                type="button"
                onClick={() => speak(reply)}
                className="flex items-center justify-center gap-1 flex-1 bg-white text-rose-700 font-bold py-2 rounded-xl text-sm shadow-sm hover:bg-rose-50"
              >
                🔊 Listen Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

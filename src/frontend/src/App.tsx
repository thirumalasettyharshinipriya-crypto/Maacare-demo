import { useState } from "react";
import BottomNav from "./components/BottomNav";
import DisclaimerBanner from "./components/DisclaimerBanner";
import {
  LANGS,
  type LangKey,
  LangProvider,
  useLang,
} from "./context/LangContext";
import AlertsPage from "./pages/AlertsPage";
import DashboardPage from "./pages/DashboardPage";
import DietPage from "./pages/DietPage";
import HomePage from "./pages/HomePage";
import HospitalsPage from "./pages/HospitalsPage";
import ProgressPage from "./pages/ProgressPage";
import ToolsPage from "./pages/ToolsPage";
import VoicePage from "./pages/VoicePage";

export type Tab =
  | "home"
  | "progress"
  | "voice"
  | "alerts"
  | "diet"
  | "dashboard"
  | "tools"
  | "hospitals";

const LANG_PILLS: { key: LangKey; label: string }[] = [
  { key: "en", label: "EN" },
  { key: "hi", label: "हिं" },
  { key: "te", label: "తె" },
  { key: "ta", label: "த" },
  { key: "kn", label: "ಕ" },
  { key: "mr", label: "म" },
  { key: "bn", label: "বা" },
];

function AppInner() {
  const [tab, setTab] = useState<Tab>("home");
  const { lang, setLang } = useLang();

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto relative">
      <DisclaimerBanner />

      {/* Language selector + saved badge */}
      <div className="flex items-center justify-between px-3 py-1.5 gap-2">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {LANG_PILLS.map((p) => (
            <button
              key={p.key}
              type="button"
              data-ocid={`lang.${p.key}.toggle`}
              onClick={() => setLang(p.key)}
              className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border transition-all ${
                lang === p.key
                  ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-rose-300"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <span className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
          💾{" "}
          {lang === "en"
            ? "Saved Locally"
            : lang === "hi"
              ? "स्थानीय रूप से सहेजा"
              : lang === "te"
                ? "లోకల్‌గా సేవ్ అయింది"
                : "Saved"}
        </span>
      </div>

      <main className="flex-1 overflow-y-auto pb-24">
        {tab === "home" && <HomePage onNavigate={(t) => setTab(t as Tab)} />}
        {tab === "progress" && (
          <ProgressPage onNavigate={(t) => setTab(t as Tab)} />
        )}
        {tab === "voice" && <VoicePage />}
        {tab === "alerts" && (
          <AlertsPage onNavigate={(t) => setTab(t as Tab)} />
        )}
        {tab === "diet" && <DietPage />}
        {tab === "dashboard" && <DashboardPage />}
        {tab === "tools" && <ToolsPage />}
        {tab === "hospitals" && <HospitalsPage />}
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AppInner />
    </LangProvider>
  );
}

// Re-export LANGS so BottomNav/pages can import from App if needed
export { LANGS };

import { useState } from "react";
import BottomNav from "./components/BottomNav";
import {
  LangProvider,
} from "./context/LangContext";
import AlertsPage from "./pages/AlertsPage";
import DashboardPage from "./pages/DashboardPage";
import DietPage from "./pages/DietPage";
import HomePage from "./pages/HomePage";
import HospitalsPage from "./pages/HospitalsPage";
import ProgressPage from "./pages/ProgressPage";
import AuthPage from "./pages/AuthPage";
import ToolsPage from "./pages/ToolsPage";
import VoicePage from "./pages/VoicePage";

export type Tab =
  | "home"
  | "progress"
  | "voice"
  | "alerts"
  | "diet"
  | "tools"
  | "hospitals";


function AppInner({ onLogout }: { onLogout: () => void }) {
  const role = localStorage.getItem("role") || "PATIENT";
  const [tab, setTab] = useState<Tab>(role === "ASHA" ? "home" : "home");

  if (role === "ASHA") {
    return (
      <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto relative p-4">
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-rose-100 mt-2">
          <h1 className="text-xl font-bold text-rose-700">ASHA Portal</h1>
          <button onClick={onLogout} className="text-xs font-bold bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full shadow-sm hover:bg-gray-50">
            Sign Out
          </button>
        </div>
        <main className="flex-1 overflow-y-auto">
          <DashboardPage />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto relative">

      {/* Saved badge & logout */}
      <div className="flex items-center justify-end px-3 py-1.5 gap-2">
        <span className="shrink-0 text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
          💾
        </span>
        <button onClick={onLogout} className="shrink-0 text-xs font-bold bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded-full shadow-sm hover:bg-gray-50">
          Log Out
        </button>
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
        {tab === "tools" && <ToolsPage />}
        {tab === "hospitals" && <HospitalsPage />}
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
  };

  return (
    <LangProvider>
      {isAuthenticated ? (
        <AppInner onLogout={handleLogout} />
      ) : (
        <AuthPage onLogin={() => setIsAuthenticated(true)} />
      )}
    </LangProvider>
  );
}

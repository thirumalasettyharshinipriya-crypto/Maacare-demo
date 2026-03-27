import { useState } from "react";
import { useLang } from "../context/LangContext";

export default function AuthPage({ onLogin }: { onLogin: () => void }) {
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("PATIENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { t, setLang, lang } = useLang();

  // Sync internal state with context if needed (context is the source of truth)
  const [selectedLang, setSelectedLang] = useState(lang);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister 
        ? { name, phone, password, role } 
        : { phone, password, role };

      const res = await fetch(`http://localhost:5001${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to authenticate");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      // lang is already in localStorage via setLang
      onLogin();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLangChange(newLang: any) {
    setSelectedLang(newLang);
    setLang(newLang);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-rose-50 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-rose-100">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black text-rose-600 mb-1 tracking-tight">
            maacare
          </h1>
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest">
            {t.home}
          </p>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isRegister ? t.createAccount : t.welcomeBack}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 border border-red-200 animate-bounce">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">{t.fullName}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="Amina"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">{t.phoneNumber}</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="+91"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">{t.password}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">{t.role}</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all bg-gray-50 focus:bg-white appearance-none"
            >
              <option value="PATIENT">{t.patientRole}</option>
              <option value="ASHA">{t.ashaRole}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">{t.language}</label>
            <select
              value={selectedLang}
              onChange={(e) => handleLangChange(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all bg-gray-50 focus:bg-white appearance-none text-rose-600 font-bold"
            >
              <option value="en">English</option>
              <option value="hi">Hindi (हिंदी)</option>
              <option value="te">Telugu (తెలుగు)</option>
              <option value="ta">Tamil (தமிழ்)</option>
              <option value="kn">Kannada (ಕನ್ನಡ)</option>
              <option value="mr">Marathi (मराठी)</option>
              <option value="bn">Bengali (বাংলা)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 text-white font-black py-4 rounded-2xl mt-4 disabled:bg-rose-300 hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 active:scale-95"
          >
            {loading ? t.loading : (isRegister ? t.signUp : t.logIn)}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8 font-medium">
          {isRegister ? t.alreadyHaveAccount : t.dontHaveAccount}{" "}
          <button
            type="button"
            className="text-rose-600 font-black hover:underline"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? t.logIn : t.signUp}
          </button>
        </p>
      </div>
    </div>
  );
}

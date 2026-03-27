import type { Tab } from "../App";
import { useLang } from "../context/LangContext";

const TAB_ICONS: Record<Tab, string> = {
  home: "🏠",
  progress: "🤰",
  voice: "🎤",
  alerts: "🆘",
  diet: "🥗",
  dashboard: "📋",
  tools: "🛠️",
  hospitals: "🏥",
};

const TAB_KEYS: Tab[] = [
  "home",
  "progress",
  "voice",
  "alerts",
  "diet",
  "dashboard",
  "tools",
  "hospitals",
];
const LANG_KEYS: (keyof ReturnType<typeof useLang>["t"])[] = [
  "home",
  "progress",
  "voice",
  "alerts",
  "diet",
  "dashboard",
  "tools",
  "hospitals",
];

export default function BottomNav({
  active,
  onChange,
}: { active: Tab; onChange: (t: Tab) => void }) {
  const { t } = useLang();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto"
      style={{
        background: "oklch(1 0 0 / 0.97)",
        borderTop: "1px solid oklch(0.9 0.03 15)",
        boxShadow: "0 -4px 20px oklch(0.52 0.2 15 / 0.1)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex">
        {TAB_KEYS.map((id, idx) => (
          <button
            type="button"
            key={id}
            data-ocid={`nav.${id}.link`}
            onClick={() => onChange(id)}
            className={`flex-1 flex flex-col items-center py-2 px-0.5 transition-all duration-200 relative ${
              active === id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {active === id && (
              <span
                className="absolute top-0 h-0.5 rounded-b-full w-8"
                style={{ background: "oklch(0.52 0.2 15)" }}
              />
            )}
            <span
              className={`text-base transition-transform duration-200 ${active === id ? "scale-110" : ""}`}
            >
              {TAB_ICONS[id]}
            </span>
            <span className="text-[8px] font-bold leading-tight truncate w-full text-center">
              {t[LANG_KEYS[idx]]}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

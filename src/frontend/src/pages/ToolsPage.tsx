import { Progress } from "@/components/ui/progress";
import { useEffect, useRef, useState } from "react";

type ToolTab = "kicks" | "contractions" | "water";

interface ContractionRecord {
  id: string;
  start: number;
  duration: number; // seconds
  interval: number; // seconds since last one
}

interface KickSession {
  date: string;
  count: number;
  duration: number; // seconds
}

const WATER_TARGET = 8;
const KICK_TARGET = 10;

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

// ─── Baby Kick Counter ───────────────────────────────────────────────────────
function KickCounter() {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sessions, setSessions] = useState<KickSession[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("kick_sessions") ?? "[]");
    } catch {
      return [];
    }
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  function addKick() {
    if (!running) setRunning(true);
    setCount((c) => c + 1);
  }

  function reset() {
    if (count > 0) {
      const session: KickSession = {
        date: getTodayKey(),
        count,
        duration: elapsed,
      };
      const updated = [session, ...sessions].slice(0, 10);
      setSessions(updated);
      localStorage.setItem("kick_sessions", JSON.stringify(updated));
    }
    setCount(0);
    setElapsed(0);
    setRunning(false);
  }

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const progress = Math.min((count / KICK_TARGET) * 100, 100);

  return (
    <div className="space-y-5">
      {/* Big Kick Button */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          data-ocid="kicks.primary_button"
          onClick={addKick}
          className="w-48 h-48 rounded-full text-white font-bold text-xl flex flex-col items-center justify-center gap-2 shadow-rose-lg transition-all active:scale-90"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.52 0.2 15), oklch(0.62 0.18 340))",
          }}
        >
          <span className="text-5xl">{count}</span>
          <span className="text-base opacity-90">Tap Each Kick</span>
          <span className="text-xs opacity-70">प्रत्येक किक टैप करें</span>
          <span className="text-xs opacity-70">ప్రతి కిక్ ట్యాప్ చేయండి</span>
        </button>

        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </p>
          <p className="text-xs text-muted-foreground">
            Session Timer / సెషన్ టైమర్
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-bold text-foreground">
            Progress to {KICK_TARGET} kicks / {KICK_TARGET} కిక్కులు
          </p>
          <span
            className={`text-sm font-bold px-2 py-0.5 rounded-full ${
              count >= KICK_TARGET
                ? "bg-green-100 text-green-700"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {count}/{KICK_TARGET}
          </span>
        </div>
        <Progress value={progress} className="h-3" />
        {count >= KICK_TARGET && (
          <p className="text-green-700 text-sm font-semibold mt-2 text-center">
            🎉 Goal reached! / లక్ష్యం చేరుకున్నారు!
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-2 text-center">
          💡 10 kicks in 2 hrs = healthy baby / 10 కిక్కులు = ఆరోగ్యకరమైన శిశువు
        </p>
      </div>

      <button
        type="button"
        data-ocid="kicks.reset.button"
        onClick={reset}
        className="w-full py-3 rounded-2xl font-bold border-2 border-border text-foreground bg-card transition-all active:scale-95"
      >
        Save & Reset / సేవ్ & రీసెట్
      </button>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <div className="bg-card rounded-2xl p-4 border border-border">
          <p className="font-bold text-primary mb-3">
            📅 Recent Sessions / ఇటీవలి సెషన్‌లు
          </p>
          {sessions.slice(0, 5).map((s, i) => (
            <div
              key={`${s.date}-${i}`}
              data-ocid={`kicks.session.item.${i + 1}`}
              className="flex items-center justify-between py-2 border-b border-border last:border-0 text-sm"
            >
              <span className="text-muted-foreground">{s.date}</span>
              <span className="font-semibold text-foreground">
                {s.count} kicks
              </span>
              <span className="text-muted-foreground">
                {Math.floor(s.duration / 60)}m
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Contraction Timer ───────────────────────────────────────────────────────
function ContractionTimer() {
  const [contractions, setContractions] = useState<ContractionRecord[]>([]);
  const [active, setActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    tickRef.current = setInterval(() => setNow(Date.now()), 500);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  function startContraction() {
    setActive(true);
    setStartTime(Date.now());
  }

  function stopContraction() {
    if (!startTime) return;
    const duration = Math.round((Date.now() - startTime) / 1000);
    const last = contractions[0];
    const interval = last
      ? Math.round((startTime - (last.start + last.duration * 1000)) / 1000)
      : 0;
    const record: ContractionRecord = {
      id: Date.now().toString(),
      start: startTime,
      duration,
      interval,
    };
    setContractions((prev) => [record, ...prev]);
    setActive(false);
    setStartTime(null);
  }

  function clear() {
    setContractions([]);
    setActive(false);
    setStartTime(null);
  }

  const currentDuration =
    active && startTime ? Math.round((now - startTime) / 1000) : 0;
  const lastInterval = contractions[0]?.interval ?? null;

  return (
    <div className="space-y-4">
      {/* Status */}
      <div
        className={`rounded-3xl p-5 text-white text-center shadow-lg transition-all ${
          active ? "" : ""
        }`}
        style={{
          background: active
            ? "linear-gradient(135deg, oklch(0.5 0.24 25), oklch(0.55 0.22 15))"
            : "linear-gradient(135deg, oklch(0.52 0.2 15), oklch(0.62 0.18 340))",
        }}
      >
        {active ? (
          <>
            <p className="text-5xl font-bold">{currentDuration}s</p>
            <p className="text-sm opacity-80 mt-1">
              Contraction ongoing / సంకోచం జరుగుతోంది
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-bold">Ready to time</p>
            <p className="text-sm opacity-80">సమయం లెక్కించడానికి సిద్ధం</p>
            {lastInterval !== null && lastInterval > 0 && (
              <p
                className={`text-sm font-bold mt-2 px-3 py-1 rounded-full inline-block ${
                  lastInterval < 300 ? "bg-red-200 text-red-900" : "bg-white/20"
                }`}
              >
                {lastInterval < 300 ? "⚠️ " : ""}Last interval:{" "}
                {Math.floor(lastInterval / 60)}m {lastInterval % 60}s
                {lastInterval < 300 ? " — Go to hospital!" : ""}
              </p>
            )}
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          data-ocid="contractions.start.primary_button"
          onClick={active ? stopContraction : startContraction}
          className="py-5 rounded-2xl font-bold text-white text-lg transition-all active:scale-95 shadow-rose-md"
          style={{
            background: active
              ? "linear-gradient(135deg, oklch(0.5 0.24 25), oklch(0.55 0.22 15))"
              : "linear-gradient(135deg, oklch(0.52 0.2 15), oklch(0.62 0.18 340))",
          }}
        >
          {active ? "⏹ Stop" : "▶ Start"}
          <p className="text-xs font-normal opacity-80">
            {active ? "ఆపు" : "ప్రారంభించు"}
          </p>
        </button>
        <button
          type="button"
          data-ocid="contractions.clear.button"
          onClick={clear}
          className="py-5 rounded-2xl font-bold text-foreground border-2 border-border bg-card transition-all active:scale-95"
        >
          🗑 Clear
          <p className="text-xs font-normal text-muted-foreground">క్లియర్ చేయి</p>
        </button>
      </div>

      {/* Contractions List */}
      {contractions.length > 0 ? (
        <div className="bg-card rounded-2xl p-4 border border-border space-y-2">
          <p className="font-bold text-primary mb-1">
            📊 Contractions / సంకోచాలు
          </p>
          {contractions.slice(0, 8).map((c, i) => (
            <div
              key={c.id}
              data-ocid={`contractions.item.${i + 1}`}
              className={`flex items-center justify-between p-3 rounded-xl text-sm ${
                c.interval > 0 && c.interval < 300
                  ? "bg-red-50 border border-red-200"
                  : "bg-muted"
              }`}
            >
              <span className="font-semibold text-foreground">
                #{contractions.length - i}
              </span>
              <span className="text-foreground">{c.duration}s duration</span>
              {c.interval > 0 && (
                <span
                  className={`font-bold ${
                    c.interval < 300
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {c.interval < 300 ? "⚠️ " : ""}
                  {Math.floor(c.interval / 60)}m{c.interval % 60}s apart
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          data-ocid="contractions.empty_state"
          className="text-center py-8 text-muted-foreground"
        >
          <p className="text-4xl mb-2">⏱️</p>
          <p>No contractions recorded yet</p>
          <p className="text-xs">ఇంకా సంకోచాలు నమోదు కాలేదు</p>
        </div>
      )}

      <div
        className="rounded-xl p-3 border border-amber-200"
        style={{ background: "oklch(0.97 0.04 80)" }}
      >
        <p className="text-sm text-amber-800 font-medium">
          ⚠️ Contractions &lt;5 min apart = go to hospital immediately! / 5 నిమిషాల
          కంటే తక్కువ = వెంటనే ఆసుపత్రికి వెళ్ళండి!
        </p>
      </div>
    </div>
  );
}

// ─── Water Tracker ───────────────────────────────────────────────────────────
function WaterTracker() {
  const [glasses, setGlasses] = useState<boolean[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("water_tracker") ?? "{}");
      if (saved.date === getTodayKey()) {
        return saved.glasses as boolean[];
      }
    } catch {}
    return Array(WATER_TARGET).fill(false);
  });

  function toggleGlass(i: number) {
    setGlasses((prev) => {
      const updated = [...prev];
      updated[i] = !updated[i];
      localStorage.setItem(
        "water_tracker",
        JSON.stringify({ date: getTodayKey(), glasses: updated }),
      );
      return updated;
    });
  }

  function resetAll() {
    const empty = Array(WATER_TARGET).fill(false);
    setGlasses(empty);
    localStorage.setItem(
      "water_tracker",
      JSON.stringify({ date: getTodayKey(), glasses: empty }),
    );
  }

  const filled = glasses.filter(Boolean).length;
  const progress = (filled / WATER_TARGET) * 100;

  return (
    <div className="space-y-5">
      {/* Header status */}
      <div
        className="rounded-3xl p-5 text-white text-center shadow-rose-md"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.55 0.18 230), oklch(0.6 0.15 200))",
        }}
      >
        <p className="text-5xl font-bold">{filled}</p>
        <p className="text-lg opacity-90">of {WATER_TARGET} glasses</p>
        <p className="text-sm opacity-70">
          {WATER_TARGET}లో {filled} గ్లాసులు · {WATER_TARGET} में से {filled} गिलास
        </p>
      </div>

      {/* Glass Grid */}
      <div className="bg-card rounded-2xl p-5 border border-border">
        <p className="font-bold text-primary mb-4 text-center">
          Tap to fill / ట్యాప్ చేయండి
        </p>
        <div className="grid grid-cols-4 gap-3 justify-items-center">
          {Array.from({ length: WATER_TARGET }, (_, slot) => slot).map(
            (slot) => {
              const isFilled = glasses[slot];
              return (
                <button
                  type="button"
                  key={`glass-slot-${slot + 1}`}
                  data-ocid={"water.glass.toggle"}
                  onClick={() => toggleGlass(slot)}
                  className="w-16 h-20 rounded-2xl flex flex-col items-center justify-center text-3xl transition-all active:scale-90 border-2"
                  style={{
                    background: isFilled
                      ? "linear-gradient(180deg, oklch(0.7 0.15 220), oklch(0.6 0.18 230))"
                      : "oklch(0.95 0.02 220)",
                    borderColor: isFilled
                      ? "oklch(0.55 0.18 230)"
                      : "oklch(0.88 0.03 220)",
                  }}
                  title={`Glass ${slot + 1}`}
                >
                  <span className={isFilled ? "" : "opacity-30"}>💧</span>
                  <span
                    className="text-xs font-bold mt-1"
                    style={{ color: isFilled ? "white" : "oklch(0.6 0.1 220)" }}
                  >
                    {slot + 1}
                  </span>
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-bold text-foreground">
            Daily Goal / రోజువారీ లక్ష్యం
          </p>
          <span
            className={`text-sm font-bold px-2 py-0.5 rounded-full ${
              filled >= WATER_TARGET
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {filled}/{WATER_TARGET}
          </span>
        </div>
        <Progress value={progress} className="h-3" />
        {filled >= WATER_TARGET && (
          <p className="text-green-700 text-sm font-semibold mt-2 text-center">
            🎉 Daily goal reached! / రోజువారీ లక్ష్యం చేరుకున్నారు!
          </p>
        )}
      </div>

      <button
        type="button"
        data-ocid="water.reset.button"
        onClick={resetAll}
        className="w-full py-3 rounded-2xl font-bold border-2 border-border text-foreground bg-card transition-all active:scale-95"
      >
        Reset Today / రీసెట్ · रीसेट
      </button>

      <div
        className="rounded-xl p-3 border border-blue-200"
        style={{ background: "oklch(0.97 0.03 240)" }}
      >
        <p className="text-sm text-blue-800 font-medium">
          💡 Resets automatically at midnight / అర్థరాత్రి స్వయంచాలకంగా రీసెట్ అవుతుంది
        </p>
      </div>
    </div>
  );
}

// ─── ToolsPage ───────────────────────────────────────────────────────────────
export default function ToolsPage() {
  const [tool, setTool] = useState<ToolTab>("kicks");

  const tools: { id: ToolTab; icon: string; label: string; sub: string }[] = [
    { id: "kicks", icon: "👶", label: "Baby Kicks", sub: "కిక్ కౌంటర్" },
    { id: "contractions", icon: "⏱️", label: "Contractions", sub: "సంకోచ టైమర్" },
    { id: "water", icon: "💧", label: "Water", sub: "నీరు ట్రాకర్" },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div
        className="rounded-3xl p-5 text-white shadow-rose-md"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.52 0.2 15), oklch(0.62 0.18 340))",
        }}
      >
        <p className="text-3xl mb-1">🛠️</p>
        <h2 className="text-2xl font-bold">Smart Tools</h2>
        <p className="text-sm opacity-80">स्मार्ट टूल्स · స్మార్ట్ టూల్స్</p>
      </div>

      {/* Tool Tabs */}
      <div className="flex gap-2">
        {tools.map((t) => (
          <button
            type="button"
            key={t.id}
            data-ocid={`tools.${t.id}.tab`}
            onClick={() => setTool(t.id)}
            className={`flex-1 py-3 px-1 rounded-2xl font-bold text-sm border-2 transition-all active:scale-95 flex flex-col items-center gap-0.5 ${
              tool === t.id
                ? "text-primary-foreground border-transparent shadow-rose-sm"
                : "bg-card text-foreground border-border"
            }`}
            style={tool === t.id ? { background: "oklch(0.52 0.2 15)" } : {}}
          >
            <span className="text-xl">{t.icon}</span>
            <span>{t.label}</span>
            <span className="text-[9px] font-normal opacity-70">{t.sub}</span>
          </button>
        ))}
      </div>

      {/* Tool Content */}
      {tool === "kicks" && <KickCounter />}
      {tool === "contractions" && <ContractionTimer />}
      {tool === "water" && <WaterTracker />}
    </div>
  );
}

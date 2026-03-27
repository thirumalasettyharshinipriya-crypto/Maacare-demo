import { useState } from "react";
import { useLang } from "../context/LangContext";
import { dietPlan } from "../data/dietData";
import { exercisePlan } from "../data/exerciseData";
import { computePregnancyInfo, store } from "../store";

const EXERCISE_VIDEOS: Record<
  1 | 2 | 3,
  { title: string; query: string; desc: string; emoji: string }[]
> = {
  1: [
    {
      title: "Prenatal Yoga – Gentle Start",
      query: "prenatal yoga first trimester gentle beginner",
      desc: "Gentle yoga for first trimester",
      emoji: "🧘‍♀️",
    },
    {
      title: "Breathing & Relaxation",
      query: "pregnancy breathing exercises relaxation first trimester",
      desc: "Breathing exercises for relaxation",
      emoji: "💨",
    },
    {
      title: "Stretching for Beginners",
      query: "safe stretching exercises early pregnancy first trimester",
      desc: "Safe stretches for early pregnancy",
      emoji: "🤸‍♀️",
    },
  ],
  2: [
    {
      title: "Prenatal Workout",
      query: "prenatal workout second trimester full body safe",
      desc: "Full body prenatal workout",
      emoji: "💪",
    },
    {
      title: "Yoga Flow",
      query: "prenatal yoga second trimester yoga flow",
      desc: "Yoga flow for second trimester",
      emoji: "🧘‍♀️",
    },
    {
      title: "Pelvic Floor Exercises",
      query: "pelvic floor exercises pregnancy kegel second trimester",
      desc: "Strengthen pelvic floor muscles",
      emoji: "🌸",
    },
  ],
  3: [
    {
      title: "Prenatal Yoga – Third Trimester",
      query: "prenatal yoga third trimester comfort relaxation",
      desc: "Yoga for third trimester comfort",
      emoji: "🧘‍♀️",
    },
    {
      title: "Birth Preparation",
      query: "pregnancy birth preparation exercises labor third trimester",
      desc: "Prepare your body for labor",
      emoji: "👶",
    },
    {
      title: "Gentle Walking & Breathing",
      query: "gentle walking breathing exercises third trimester pregnancy",
      desc: "Low-impact movement and breathing",
      emoji: "🚶‍♀️",
    },
  ],
};

export default function DietPage() {
  const patient = store.getPatient();
  const info = patient ? computePregnancyInfo(patient.lmpDate) : null;
  const [trimester, setTrimester] = useState<1 | 2 | 3>(info?.trimester ?? 1);
  const [tab, setTab] = useState<"diet" | "exercise">("diet");
  const [videoIdx, setVideoIdx] = useState(0);
  const { t } = useLang();

  const diet = dietPlan[trimester];
  const ex = exercisePlan[trimester];
  const videos = EXERCISE_VIDEOS[trimester];
  const currentVideo = videos[videoIdx];

  function changeTrimester(tr: 1 | 2 | 3) {
    setTrimester(tr);
    setVideoIdx(0);
  }

  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(currentVideo.query)}`;

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
        <p className="text-3xl mb-1">🥗</p>
        <h2 className="text-2xl font-bold">{t.diet} & Wellness</h2>
        <p className="text-sm opacity-80">आहार और स्वास्थ्य · ఆహారం & ఆరోగ్యం</p>
      </div>

      {/* Trimester Selector */}
      <div className="flex gap-2">
        {([1, 2, 3] as const).map((tr) => (
          <button
            type="button"
            key={tr}
            data-ocid={`diet.trimester${tr}.tab`}
            onClick={() => changeTrimester(tr)}
            className={`flex-1 py-3 rounded-2xl font-bold border-2 transition-all active:scale-95 ${
              trimester === tr
                ? "text-primary-foreground border-transparent shadow-rose-sm"
                : "bg-card text-foreground border-border"
            }`}
            style={trimester === tr ? { background: "oklch(0.52 0.2 15)" } : {}}
          >
            T{tr} — {tr === 1 ? "Wk 1–13" : tr === 2 ? "Wk 14–26" : "Wk 27+"}
          </button>
        ))}
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2 bg-muted rounded-2xl p-1">
        {(["diet", "exercise"] as const).map((tb) => (
          <button
            type="button"
            key={tb}
            data-ocid={`diet.${tb}.tab`}
            onClick={() => setTab(tb)}
            className={`flex-1 py-2.5 rounded-xl font-semibold transition-all ${
              tab === tb
                ? "bg-card text-primary shadow-xs"
                : "text-muted-foreground"
            }`}
          >
            {tb === "diet" ? `🥗 ${t.diet}` : `🏃‍♀️ ${t.exercise}`}
          </button>
        ))}
      </div>

      {tab === "diet" ? (
        <>
          <div
            className="rounded-2xl p-4 border border-amber-200"
            style={{ background: "oklch(0.97 0.04 80)" }}
          >
            <p className="text-sm font-bold text-amber-800 mb-1">
              💡 Daily Tip / రోజువారీ చిట్కా
            </p>
            <p className="text-sm text-amber-900">{diet.tip}</p>
          </div>
          <div className="bg-card rounded-2xl shadow-rose-sm p-4 border border-border">
            <h3 className="font-bold text-green-700 text-lg mb-3">
              ✅ Foods to Eat
              <span className="text-sm font-normal text-muted-foreground ml-1">
                / खाएं / తినాల్సిన ఆహారాలు
              </span>
            </h3>
            <div className="space-y-2">
              {diet.eat.map((f) => (
                <div
                  key={f}
                  className="flex items-start gap-2 rounded-xl px-3 py-2"
                  style={{ background: "oklch(0.96 0.04 150)" }}
                >
                  <span className="text-green-500 mt-0.5 font-bold">●</span>
                  <p className="text-sm text-foreground">{f}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-2xl shadow-rose-sm p-4 border border-border">
            <h3 className="font-bold text-destructive text-lg mb-3">
              🚫 Foods to Avoid
              <span className="text-sm font-normal text-muted-foreground ml-1">
                / न खाएं / తినకూడని ఆహారాలు
              </span>
            </h3>
            <div className="space-y-2">
              {diet.avoid.map((f) => (
                <div
                  key={f}
                  className="flex items-start gap-2 rounded-xl px-3 py-2"
                  style={{ background: "oklch(0.97 0.03 25)" }}
                >
                  <span className="text-destructive mt-0.5 font-bold">✗</span>
                  <p className="text-sm text-foreground">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Multi-video Player */}
          <div className="bg-card rounded-2xl shadow-rose-sm overflow-hidden border border-border">
            <div className="px-4 pt-4 pb-2">
              <p className="font-bold text-primary text-base">
                🎬 {t.exercise} Video / వ్యాయామ వీడియో
              </p>
              <p className="text-sm text-foreground font-semibold mt-0.5">
                {currentVideo.title}
              </p>
              <p className="text-xs text-muted-foreground">
                Video {videoIdx + 1} of {videos.length}
              </p>
            </div>
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative w-full cursor-pointer group"
              style={{ paddingBottom: "56.25%" }}
            >
              {/* Thumbnail fallback using gradient + emoji */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.85 0.08 340), oklch(0.78 0.1 15))",
                }}
              >
                <span className="text-7xl mb-2">{currentVideo.emoji}</span>
                <p className="text-white font-bold text-base text-center px-4">
                  {currentVideo.title}
                </p>
                <p className="text-white/80 text-xs text-center px-6 mt-1">
                  {currentVideo.desc}
                </p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                  <svg
                    aria-label="Play"
                    role="img"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-8 h-8 ml-1"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                Tap to search on YouTube
              </div>
            </a>
            {/* Prev / Next */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <button
                type="button"
                data-ocid="diet.video.pagination_prev"
                onClick={() => setVideoIdx((i) => Math.max(0, i - 1))}
                disabled={videoIdx === 0}
                className="flex items-center gap-1 text-sm font-bold px-4 py-2 rounded-xl border-2 border-rose-200 text-rose-500 disabled:opacity-30 active:scale-95 transition-all"
              >
                ← Prev
              </button>
              <span className="text-sm font-semibold text-muted-foreground">
                {videoIdx + 1} / {videos.length}
              </span>
              <button
                type="button"
                data-ocid="diet.video.pagination_next"
                onClick={() =>
                  setVideoIdx((i) => Math.min(videos.length - 1, i + 1))
                }
                disabled={videoIdx === videos.length - 1}
                className="flex items-center gap-1 text-sm font-bold px-4 py-2 rounded-xl border-2 border-rose-200 text-rose-500 disabled:opacity-30 active:scale-95 transition-all"
              >
                Next →
              </button>
            </div>
          </div>

          <div
            className="rounded-xl p-3 border border-blue-200"
            style={{ background: "oklch(0.97 0.03 240)" }}
          >
            <p className="text-sm text-blue-800 font-medium">
              💧 Drink 8–10 glasses of water daily · రోజూ 8–10 గ్లాసుల నీరు తాగండి
            </p>
          </div>

          {ex.map((e) => (
            <div
              key={e.name}
              className="bg-card rounded-2xl shadow-rose-sm p-4 border border-border flex gap-4"
            >
              <span className="text-4xl">{e.icon}</span>
              <div>
                <p className="font-bold text-foreground text-lg">{e.name}</p>
                <p className="text-xs text-primary font-semibold mb-1">
                  {e.duration}
                </p>
                <p className="text-sm text-muted-foreground">{e.description}</p>
              </div>
            </div>
          ))}

          <div
            className="rounded-xl p-3 border"
            style={{
              background: "oklch(0.96 0.03 300)",
              borderColor: "oklch(0.8 0.05 300)",
            }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: "oklch(0.4 0.1 300)" }}
            >
              🛌 Rest: Sleep 8–9 hours. Lie on left side. · 8–9 గంటలు నిద్రపోండి.
              ఎడమ వైపు పడుకోండి.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

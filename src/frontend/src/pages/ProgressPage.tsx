import { useLang } from "../context/LangContext";
import { store, computePregnancyInfo } from "../store";
import type { Tab } from "../App";

// Approximate baby size per week
const BABY_SIZES: Record<number, { emoji: string, fruit: string }> = {
  1: { emoji: "🥚", fruit: "Poppy Seed" },
  2: { emoji: "🥚", fruit: "Sesame Seed" },
  3: { emoji: "🍏", fruit: "Apple Seed" },
  4: { emoji: "🔵", fruit: "Lentil" },
  5: { emoji: "🍇", fruit: "Blueberry" },
  6: { emoji: "🫐", fruit: "Sweet Pea" },
  7: { emoji: "🔴", fruit: "Cranberry" },
  8: { emoji: "🍓", fruit: "Raspberry" },
  9: { emoji: "🍇", fruit: "Grape" },
  10: { emoji: "🌿", fruit: "Kumquat" },
  11: { emoji: "🍋", fruit: "Fig" },
  12: { emoji: "🍋", fruit: "Lime" },
  13: { emoji: "🍑", fruit: "Peach" },
  14: { emoji: "🍋", fruit: "Lemon" },
  15: { emoji: "🍎", fruit: "Apple" },
  16: { emoji: "🥑", fruit: "Avocado" },
  17: { emoji: "🧅", fruit: "Turnip" },
  18: { emoji: "🫑", fruit: "Bell Pepper" },
  19: { emoji: "🍅", fruit: "Heirloom Tomato" },
  20: { emoji: "🍌", fruit: "Banana" },
  21: { emoji: "🥕", fruit: "Carrot" },
  22: { emoji: "🥥", fruit: "Coconut" },
  23: { emoji: "🥭", fruit: "Mango" },
  24: { emoji: "🌽", fruit: "Ear of Corn" },
  25: { emoji: "🥦", fruit: "Cauliflower" },
  26: { emoji: "🥬", fruit: "Lettuce" },
  27: { emoji: "🍆", fruit: "Eggplant" },
  28: { emoji: "🍈", fruit: "Squash" },
  29: { emoji: "🎃", fruit: "Butternut Squash" },
  30: { emoji: "🥒", fruit: "Cucumber" },
  31: { emoji: "🍍", fruit: "Pineapple" },
  32: { emoji: "🍈", fruit: "Cantaloupe" },
  33: { emoji: "🥬", fruit: "Celery" },
  34: { emoji: "🍈", fruit: "Honeydew Melon" },
  35: { emoji: "🥥", fruit: "Spaghetti Squash" },
  36: { emoji: "🥬", fruit: "Romaine Lettuce" },
  37: { emoji: "🥬", fruit: "Swiss Chard" },
  38: { emoji: "🍠", fruit: "Rhubarb" },
  39: { emoji: "🍉", fruit: "Mini Watermelon" },
  40: { emoji: "🍉", fruit: "Watermelon" }
};

export default function ProgressPage({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const { t, lang } = useLang();
  
  // Try to load patient from mock store
  const patient = store.getPatient();
  let info: ReturnType<typeof computePregnancyInfo>;
  
  // Use current date as the simulation if no patient is found
  if (patient) {
    info = computePregnancyInfo(patient.lmpDate);
  } else {
    // Generate a mock 22 weeks progress if no patient profile exists
    const mockLmp = new Date();
    mockLmp.setDate(mockLmp.getDate() - (22 * 7));
    info = computePregnancyInfo(mockLmp.toISOString());
  }

  const week = Math.min(Math.max(info.week, 1), 40);
  const sizeData = BABY_SIZES[week] || BABY_SIZES[40];
  const progressPercent = Math.min((week / 40) * 100, 100);

  return (
    <div className="p-4 space-y-6 pb-20 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">
          {t.progress} / ప్రగతి
        </h2>
      </div>

      <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-rose-100 relative overflow-hidden text-center">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 p-12 bg-rose-200 blur-3xl rounded-full opacity-30 w-32 h-32 transform translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 left-0 p-12 bg-orange-200 blur-3xl rounded-full opacity-30 w-32 h-32 transform -translate-x-10 translate-y-10"></div>
        
        <p className="font-medium text-rose-500 mb-1 uppercase tracking-widest text-xs relative z-10">
           {lang === 'te' ? 'మీరు' : lang === 'hi' ? 'आप हैं' : 'You are'}
        </p>
        <h3 className="text-5xl font-black text-gray-800 drop-shadow-sm mb-2 relative z-10">
          Week {week}
        </h3>
        <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-6 relative z-10">
          Trimester {info.trimester}
        </p>

        {/* Baby Size visualizer */}
        <div className="my-6 relative z-10">
          <div className="text-8xl filter drop-shadow-xl hover:scale-110 transition-transform duration-300 cursor-pointer">
            {sizeData.emoji}
          </div>
          <p className="text-sm font-bold text-gray-700 mt-4 px-4 py-2 bg-rose-50 rounded-full inline-block border border-rose-100">
            {lang === 'te' ? 'మీ బిడ్డ పరిమాణం:' : lang === 'hi' ? 'आपके बच्चे का आकार:' : 'Baby is the size of a'}{" "}
            <span className="text-rose-600">{sizeData.fruit}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 relative z-10">
          <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
            <span>Wk 1</span>
            <span className="text-rose-500">Wk {week}</span>
            <span>Wk 40</span>
          </div>
          <div className="w-full bg-rose-100 rounded-full h-3 mb-2 shadow-inner overflow-hidden">
            <div 
              className="bg-gradient-to-r from-rose-400 to-rose-500 h-3 rounded-full transition-all duration-1000 ease-in-out relative"
              style={{ width: progressPercent + "%" }}
            >
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress_1s_linear_infinite]"></div>
            </div>
          </div>
          <p className="text-xs font-semibold text-gray-500 text-right mt-2">
             📅 {lang === 'te' ? 'అంచనా తేదీ:' : lang === 'hi' ? 'अनुमानित तिथि:' : 'Estimated Due Date:'} <span className="text-rose-600">{new Date(info.edd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate("tools")}
          className="bg-white p-4 rounded-3xl shadow-md border border-orange-100 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 transition-colors"
        >
          <span className="text-3xl">🧮</span>
          <span className="text-sm font-bold text-gray-700 text-center">{lang === 'te' ? 'కిక్ కౌంటర్' : lang === 'hi' ? 'किक काउंटर' : 'Kick Counter'}</span>
        </button>

        <button 
          onClick={() => onNavigate("diet")}
          className="bg-white p-4 rounded-3xl shadow-md border border-green-100 flex flex-col items-center justify-center gap-2 hover:bg-green-50 transition-colors"
        >
          <span className="text-3xl">🥗</span>
          <span className="text-sm font-bold text-gray-700 text-center">{t.diet} / డైట్</span>
        </button>
      </div>

      <div className="bg-rose-50 rounded-[2rem] p-6 border border-rose-200">
        <h4 className="font-bold text-rose-800 mb-2">💡 Weekly Insight</h4>
        <p className="text-sm text-rose-900 leading-relaxed font-medium">
          {week < 14 ? "Your baby's major organs are forming! Make sure to stay hydrated and take your prenatal vitamins focusing on folic acid." : 
           week < 28 ? "You are in the \"honeymoon phase\" of pregnancy! You might start feeling light flutters as your baby begins to move." : 
           "You're in the home stretch! Your baby is gaining weight rapidly now to prepare for life outside the womb. Rest up!"}
        </p>
      </div>
    </div>
  );
}

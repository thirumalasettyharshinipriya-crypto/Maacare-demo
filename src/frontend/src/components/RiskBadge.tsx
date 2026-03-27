import type { RiskLevel } from "../types";

export default function RiskBadge({ level }: { level: RiskLevel }) {
  const cfg = {
    low: "bg-green-100 text-green-800 border-green-300",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    high: "bg-red-100 text-red-800 border-red-300",
  }[level];
  const label = {
    low: "✅ Low Risk",
    medium: "⚠️ Medium Risk",
    high: "🚨 HIGH RISK",
  }[level];
  return (
    <span
      className={`inline-block border rounded-full px-3 py-1 text-sm font-bold ${cfg}`}
    >
      {label}
    </span>
  );
}

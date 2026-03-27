import React from "react";
import { type Tab } from "../App";

interface ProgressPageProps {
  onNavigate?: (tab: Tab) => void;
}

export default function ProgressPage({ onNavigate }: ProgressPageProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Progress</h1>
      <p>This page is under construction.</p>
      {onNavigate && (
        <button
          onClick={() => onNavigate("home")}
          className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-md"
        >
          Go Back Home
        </button>
      )}
    </div>
  );
}

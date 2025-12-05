// components/Timer.tsx
"use client";

import { useEffect, useState } from "react";

type TimerProps = {
  minutes: number;
  onExpire: () => void;
};

export default function Timer({ minutes, onExpire }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);

  useEffect(() => {
    setSecondsLeft(minutes * 60);
  }, [minutes]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire();
      return;
    }

    const id = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [secondsLeft, onExpire]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  const mm = String(mins).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");

  // color shift as time runs out
  let colorClasses =
    "bg-slate-900 text-slate-50 dark:bg-slate-100 dark:text-slate-900";
  if (secondsLeft <= 60) {
    // last minute
    colorClasses =
      "bg-red-600 text-white dark:bg-red-500 dark:text-white animate-pulse";
  } else if (secondsLeft <= 5 * 60) {
    // last 5 minutes
    colorClasses =
      "bg-amber-500 text-white dark:bg-amber-400 dark:text-slate-900";
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium shadow ${colorClasses}`}
    >
      <span className="uppercase text-[10px] tracking-wide opacity-80">
        Time left
      </span>
      <span className="font-mono text-base">
        {mm}:{ss}
      </span>
    </div>
  );
}

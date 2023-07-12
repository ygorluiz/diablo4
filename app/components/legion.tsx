"use client";

import { useEffect } from "react";
import { RECENT_EVENTS } from "../lib/events";

function formatTimeLeft(timeLeft: number) {
  // timeLeft is in miliseconds
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
    .toFixed(0)
    .padStart(2, "0");
  const minutesLeft = Math.floor((timeLeft / (1000 * 60)) % 60)
    .toFixed(0)
    .padStart(2, "0");
  const secondsLeft = Math.floor((timeLeft / 1000) % 60)
    .toFixed(0)
    .padStart(2, "0");

  return `${hoursLeft}:${minutesLeft}:${secondsLeft}`;
}

export default function Legion({
  recentEvents,
  onRefreshRecentEvents,
  time,
}: {
  recentEvents: RECENT_EVENTS | undefined;
  onRefreshRecentEvents: () => Promise<RECENT_EVENTS | undefined>;
  time: number;
}) {
  const timeLeft = recentEvents
    ? Math.max(0, recentEvents.legion.timestamp * 1000 - time) ||
      Math.max(0, recentEvents.legion.expected * 1000 - time)
    : 0;

  useEffect(() => {
    if (!recentEvents) {
      return;
    }
    if (timeLeft === 0) {
      onRefreshRecentEvents();
    }
  }, [timeLeft]);

  return (
    <div className="text-gray-200 text-sm px-2.5 py-2 space-x-1 text-shadow bg-black bg-opacity-50 md:rounded-lg whitespace-nowrap pointer-events-none">
      <span className="text-orange-400 uppercase">Legion</span>
      <span className="font-mono">{formatTimeLeft(timeLeft)}</span>
    </div>
  );
}

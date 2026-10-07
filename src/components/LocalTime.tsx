"use client";

import { useEffect, useState } from "react";

/** Live clock in a fixed time zone. Renders a placeholder until mounted. */
export function LocalTime({ timeZone, label }: { timeZone: string; label: string }) {
  const [parts, setParts] = useState<{ h: string; m: string; s: string } | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => {
      const p = Object.fromEntries(fmt.formatToParts(new Date()).map((x) => [x.type, x.value]));
      setParts({ h: p.hour === "24" ? "00" : p.hour, m: p.minute, s: p.second });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return (
    <span className="font-mono text-small tabular-nums" aria-label={parts ? `${parts.h}:${parts.m} ${label}` : undefined}>
      {parts ? (
        <>
          {parts.h}
          <span className="blink">:</span>
          {parts.m}
          <span className="text-subtle">:{parts.s}</span>
        </>
      ) : (
        <span className="text-subtle">--:--:--</span>
      )}
      <span className="ml-2 text-subtle">{label}</span>
    </span>
  );
}

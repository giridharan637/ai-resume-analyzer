"use client";

import { useEffect, useState } from "react";

export function CircularScore({
  value,
  label,
  size = 180,
  gradientFrom = "#a78bfa",
  gradientTo = "#22d3ee",
}: {
  value: number;
  label: string;
  size?: number;
  gradientFrom?: string;
  gradientTo?: string;
}) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setV(value));
    return () => cancelAnimationFrame(id);
  }, [value]);

  const radius = size / 2 - 14;
  const circumference = 2 * Math.PI * radius;
  const dash = (v / 100) * circumference;
  const id = `grad-${label.replace(/\s+/g, "-")}`;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientFrom} />
              <stop offset="100%" stopColor={gradientTo} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeWidth={10}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${id})`}
            strokeWidth={10}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            style={{
              transition: "stroke-dasharray 1.6s cubic-bezier(.2,.8,.2,1)",
              filter: `drop-shadow(0 0 10px ${gradientFrom})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gradient tabular-nums">
            {Math.round(v)}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            / 100
          </span>
        </div>
      </div>
      <span className="text-sm font-medium text-foreground/90">{label}</span>
    </div>
  );
}

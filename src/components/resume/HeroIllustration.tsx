"use client";

import { Sparkles, Cpu, FileText } from "lucide-react";

export function HeroIllustration() {
  return (
    <div className="relative flex h-[420px] w-full items-center justify-center [perspective:1200px]">
      {/* Glow orb */}
      <div className="absolute h-72 w-72 rounded-full bg-gradient-to-tr from-violet-500/40 via-fuchsia-500/30 to-cyan-400/40 blur-3xl animate-pulse-glow" />

      {/* Rotating ring */}
      <div className="absolute h-[340px] w-[340px] rounded-full border border-violet-400/20 animate-spin-slow [transform:rotateX(65deg)]">
        <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-violet-400 shadow-[0_0_20px_8px_rgba(167,139,250,0.6)]" />
      </div>
      <div
        className="absolute h-[260px] w-[260px] rounded-full border border-cyan-400/20 animate-spin-slow [transform:rotateX(65deg)]"
        style={{ animationDirection: "reverse", animationDuration: "14s" }}
      >
        <div className="absolute -top-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_20px_6px_rgba(34,211,238,0.6)]" />
      </div>

      {/* Resume card 3D */}
      <div className="relative animate-float [transform-style:preserve-3d] [transform:rotateY(-14deg)_rotateX(8deg)]">
        <div className="glass-strong neon-border relative h-72 w-56 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 grid place-items-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="h-2 w-20 rounded-full bg-foreground/30" />
              <div className="mt-1 h-1.5 w-12 rounded-full bg-foreground/15" />
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <div className="h-1.5 w-full rounded-full bg-foreground/15" />
            <div className="h-1.5 w-5/6 rounded-full bg-foreground/15" />
            <div className="h-1.5 w-4/6 rounded-full bg-foreground/15" />
          </div>
          <div className="mt-4 flex gap-1.5">
            <span className="h-4 w-10 rounded-full bg-violet-500/30" />
            <span className="h-4 w-8 rounded-full bg-cyan-500/30" />
            <span className="h-4 w-12 rounded-full bg-fuchsia-500/30" />
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-foreground/10" />
            <div className="h-1.5 w-11/12 rounded-full bg-foreground/10" />
            <div className="h-1.5 w-9/12 rounded-full bg-foreground/10" />
            <div className="h-1.5 w-10/12 rounded-full bg-foreground/10" />
          </div>
          {/* Scan line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-cyan-400/60 to-transparent blur-sm animate-scan" />
        </div>

        {/* Floating chips */}
        <div className="absolute -left-10 -top-6 glass rounded-xl px-3 py-2 text-xs flex items-center gap-1.5 animate-float-slow">
          <Sparkles className="h-3.5 w-3.5 text-violet-300" />
          <span className="text-foreground/90">AI Insights</span>
        </div>
        <div
          className="absolute -right-12 top-20 glass rounded-xl px-3 py-2 text-xs flex items-center gap-1.5 animate-float-slow"
          style={{ animationDelay: "1.2s" }}
        >
          <Cpu className="h-3.5 w-3.5 text-cyan-300" />
          <span className="text-foreground/90">ATS Ready</span>
        </div>
        <div
          className="absolute -bottom-4 -left-6 glass rounded-xl px-3 py-2 text-xs flex items-center gap-1.5 animate-float-slow"
          style={{ animationDelay: "0.6s" }}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.7)]" />
          <span className="text-foreground/90">Score 92</span>
        </div>
      </div>
    </div>
  );
}

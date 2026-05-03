"use client";

import { ArrowRight, FileText, GitCompareArrows, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { CircularScore } from "@/components/resume/CircularScore";
import { Button } from "@/components/ui/button";
import { buildAnalysis, type Analysis } from "@/lib/resume-analysis";

type Slot = { name: string; analysis: Analysis } | null;

export default function ComparePage() {
  const [a, setA] = useState<Slot>(null);
  const [b, setB] = useState<Slot>(null);

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <GitCompareArrows className="h-7 w-7 text-violet-300" />
          Resume <span className="text-gradient">Comparison</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Upload two versions of your resume to see what improved — and what regressed.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Slot label="Version A" slot={a} setSlot={setA} accent="from-violet-500 to-fuchsia-500" />
        <Slot label="Version B" slot={b} setSlot={setB} accent="from-cyan-400 to-blue-500" />
      </div>

      {a && b && <Comparison a={a} b={b} />}
    </div>
  );
}

function Slot({
  label,
  slot,
  setSlot,
  accent,
}: {
  label: string;
  slot: Slot;
  setSlot: (s: Slot) => void;
  accent: string;
}) {
  const [analyzing, setAnalyzing] = useState(false);
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const onFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0]!;
    if (!/\.(pdf|docx?)$/i.test(f.name)) {
      toast.error("PDF or DOCX only");
      return;
    }
    setAnalyzing(true);
    setTimeout(() => {
      setSlot({ name: f.name, analysis: buildAnalysis(f.name, f.size) });
      setAnalyzing(false);
    }, 1400);
  };

  return (
    <div className="glass-strong rounded-3xl p-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${accent} grid place-items-center text-white text-xs font-bold`}>
            {label.slice(-1)}
          </div>
          <h3 className="font-semibold">{label}</h3>
        </div>
        {slot && (
          <button
            onClick={() => setSlot(null)}
            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-foreground/5"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {!slot ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            onFiles(e.dataTransfer.files);
          }}
          onClick={() => ref.current?.click()}
          className={`mt-4 cursor-pointer rounded-2xl glass border border-dashed border-border p-8 text-center transition ${
            drag ? "scale-[1.01] glow-primary" : "hover:bg-foreground/5"
          }`}
        >
          <input
            ref={ref}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
          {analyzing ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
              <p className="text-sm text-muted-foreground">Analyzing...</p>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-8 w-8 text-muted-foreground/70" />
              <p className="mt-3 text-sm">Drop or click to upload</p>
              <p className="text-[11px] text-muted-foreground">PDF, DOCX</p>
            </>
          )}
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
            <FileText className="h-4 w-4 text-violet-300" />
            <span className="text-sm font-medium truncate">{slot.name}</span>
          </div>
          <div className="flex items-center justify-around">
            <CircularScore value={slot.analysis.resumeScore} label="Resume" size={130} />
            <CircularScore
              value={slot.analysis.atsScore}
              label="ATS"
              size={130}
              gradientFrom="#f472b6"
              gradientTo="#a78bfa"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {slot.analysis.sections.map((s) => (
              <div key={s.name} className="glass rounded-lg p-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="font-semibold">{s.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Comparison({ a, b }: { a: NonNullable<Slot>; b: NonNullable<Slot> }) {
  const diff = (k: number, l: number) => {
    const d = l - k;
    return { d, sign: d > 0 ? "+" : d < 0 ? "" : "±" };
  };
  const overall = diff(a.analysis.resumeScore, b.analysis.resumeScore);
  const ats = diff(a.analysis.atsScore, b.analysis.atsScore);

  return (
    <div className="glass-strong rounded-3xl p-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <ArrowRight className="h-5 w-5 text-cyan-300" />
        Differences
      </h3>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <DiffTile label="Overall Score" a={a.analysis.resumeScore} b={b.analysis.resumeScore} d={overall.d} />
        <DiffTile label="ATS Score" a={a.analysis.atsScore} b={b.analysis.atsScore} d={ats.d} />
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-muted-foreground">Section by section</h4>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {a.analysis.sections.map((sa) => {
            const sb = b.analysis.sections.find((x) => x.name === sa.name);
            const d = (sb?.score ?? 0) - sa.score;
            return (
              <div key={sa.name} className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{sa.name}</span>
                  <span className={d > 0 ? "text-emerald-300" : d < 0 ? "text-rose-300" : "text-muted-foreground"}>
                    {d > 0 ? "+" : ""}
                    {d}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Bar label="A" value={sa.score} color="from-violet-500 to-fuchsia-500" />
                  <Bar label="B" value={sb?.score ?? 0} color="from-cyan-400 to-blue-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DiffTile({ label, a, b, d }: { label: string; a: number; b: number; d: number }) {
  const positive = d > 0;
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="text-2xl font-bold tabular-nums">{a}</span>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-2xl font-bold tabular-nums">{b}</span>
        <span
          className={`ml-auto rounded-full border px-2 py-0.5 text-[11px] ${
            positive
              ? "border-emerald-400/40 text-emerald-300 bg-emerald-500/10"
              : d < 0
                ? "border-rose-400/40 text-rose-300 bg-rose-500/10"
                : "border-border text-muted-foreground"
          }`}
        >
          {d > 0 ? "+" : ""}
          {d}
        </span>
      </div>
    </div>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-foreground/5 overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

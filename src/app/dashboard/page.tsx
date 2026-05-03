"use client";

import {
  ArrowUpRight,
  Files,
  GitCompareArrows,
  History,
  LineChart as LineChartIcon,
  Sparkles,
  Target,
  TrendingUp,
  Wand2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CircularScore } from "@/components/resume/CircularScore";
import { useCurrentUser } from "@/lib/current-user";
import { useAnalyses } from "@/hooks/use-analyses";
import { type HistoryEntry } from "@/lib/resume-analysis";


export default function DashboardHomePage() {
  const { user } = useCurrentUser();
  const { data, isLoading } = useAnalyses(user?.email);
  const history = data ?? [];

  if (isLoading && history.length === 0) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-48 glass-strong rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 glass-strong rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const latest = history[0];
  const avgScore =
    history.length > 0
      ? Math.round(history.reduce((s, h) => s + h.analysis.resumeScore, 0) / history.length)
      : 0;
  const avgAts =
    history.length > 0
      ? Math.round(history.reduce((s, h) => s + h.analysis.atsScore, 0) / history.length)
      : 0;
  const trend =
    history.length >= 2
      ? history[0]!.analysis.resumeScore - history[history.length - 1]!.analysis.resumeScore
      : 0;

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-3xl glass-strong p-6 md:p-8 animate-fade-up">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-violet-500/40 to-cyan-400/30 blur-3xl animate-blob" />
        <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-fuchsia-500/30 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-foreground/80">All systems operational</span>
            </div>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              Welcome back, <span className="text-gradient">{firstName}</span>
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Here&apos;s a snapshot of your resume performance and AI-powered insights.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/dashboard/analyzer"
                className="ripple inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-4 py-2 text-sm font-medium text-white glow-primary hover:opacity-90 transition"
              >
                <Wand2 className="h-4 w-4" /> Analyze a resume
              </Link>
              <Link
                href="/dashboard/compare"
                className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm hover:bg-foreground/5 transition"
              >
                <GitCompareArrows className="h-4 w-4" /> Compare versions
              </Link>
            </div>
          </div>

          {/* Animated profile card */}
          <div className="relative shrink-0 [perspective:800px] animate-fade-up">
            <div className="glass-strong rounded-2xl p-5 w-full md:w-72 animate-float [transform:rotateY(-8deg)_rotateX(4deg)]">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 grid place-items-center text-white font-semibold">
                  {(user?.name?.[0] ?? "U").toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{user?.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Stat k="Resumes" v={history.length} />
                <Stat k="Avg Score" v={avgScore || "—"} />
                <Stat k="ATS" v={avgAts || "—"} />
              </div>
              <div className="mt-3 h-1 w-full rounded-full bg-foreground/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-1000"
                  style={{ width: `${Math.min(100, avgScore)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile icon={Files} label="Resumes Analyzed" value={String(history.length)} accent="from-violet-500 to-fuchsia-500" />
        <Tile icon={Zap} label="Avg Resume Score" value={avgScore ? `${avgScore}` : "—"} accent="from-fuchsia-500 to-cyan-400" />
        <Tile icon={Target} label="Avg ATS Score" value={avgAts ? `${avgAts}` : "—"} accent="from-cyan-400 to-blue-500" />
        <Tile
          icon={TrendingUp}
          label="Score Trend"
          value={trend > 0 ? `+${trend}` : trend < 0 ? `${trend}` : "—"}
          accent="from-emerald-400 to-cyan-400"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Latest analysis */}
        <div className="lg:col-span-2 glass-strong rounded-3xl p-6 animate-fade-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-300" />
              <h3 className="text-lg font-semibold">Latest Analysis</h3>
            </div>
            <Link
              href="/dashboard/history"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              View history <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {latest ? (
            <div className="mt-5 grid gap-5 md:grid-cols-[auto_1fr] items-center">
              <CircularScore
                value={latest.analysis.resumeScore}
                label={latest.fileName}
                size={150}
                gradientFrom="#a78bfa"
                gradientTo="#22d3ee"
              />
              <div>
                <div className="grid grid-cols-2 gap-2">
                  {latest.analysis.sections.map((s) => (
                    <div key={s.name} className="glass rounded-xl p-3">
                      <div className="text-[11px] text-muted-foreground">{s.name}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="text-base font-semibold">{s.score}</div>
                        <div className="flex-1 h-1 rounded-full bg-foreground/5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                            style={{ width: `${s.score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {latest.analysis.missingKeywords.slice(0, 5).map((k) => (
                    <span
                      key={k}
                      className="rounded-full px-2.5 py-1 text-[11px] border border-fuchsia-400/40 text-fuchsia-200 bg-fuchsia-500/10"
                    >
                      + {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 glass rounded-2xl p-8 text-center">
              <Wand2 className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <p className="mt-3 text-sm text-muted-foreground">
                No analyses yet. Upload your first resume to see results here.
              </p>
              <Link
                href="/dashboard/analyzer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 px-3 py-2 text-sm text-white"
              >
                <Wand2 className="h-4 w-4" /> Analyze now
              </Link>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="glass-strong rounded-3xl p-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <h3 className="text-lg font-semibold">Quick actions</h3>
          <div className="mt-4 space-y-3">
            <QuickAction href="/dashboard/analyzer" icon={Wand2} title="Analyze resume" desc="Run a fresh AI analysis" />
            <QuickAction href="/dashboard/compare" icon={GitCompareArrows} title="Compare versions" desc="Diff two resumes side-by-side" />
            <QuickAction href="/dashboard/history" icon={History} title="View history" desc={`${history.length} past analyses`} />
            <QuickAction href="/dashboard/analyzer#jobmatch" icon={Target} title="Job match" desc="Match against role keywords" />
          </div>
        </div>
      </div>

      {/* Score Trend graph */}
      <div className="glass-strong rounded-3xl p-6 animate-fade-up" style={{ animationDelay: "0.15s" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LineChartIcon className="h-5 w-5 text-cyan-300" />
            <h3 className="text-lg font-semibold">Score Trend</h3>
          </div>
          <span className="glass rounded-full px-3 py-1 text-xs text-muted-foreground">
            Last {Math.min(history.length, 12)} analyses
          </span>
        </div>
        <TrendChart history={history} />
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="glass rounded-lg py-2">
      <div className="text-base font-semibold">{v}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
    </div>
  );
}

function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateZ(0)`;
    };
    const onLeave = () => {
      el.style.transform = "perspective(800px) rotateY(0) rotateX(0)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);
  return ref;
}

function Tile({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Zap;
  label: string;
  value: string;
  accent: string;
}) {
  const ref = useTilt();
  return (
    <div
      ref={ref}
      style={{ transformStyle: "preserve-3d", transition: "transform 200ms ease-out" }}
      className="glass-strong rounded-2xl p-4 hover:-translate-y-0.5 animate-fade-up"
    >
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${accent} grid place-items-center`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="text-2xl font-bold tabular-nums">{value}</div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: typeof Zap;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl glass p-3 hover:bg-foreground/5 transition"
    >
      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500/40 to-cyan-400/40 grid place-items-center">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-[11px] text-muted-foreground">{desc}</div>
      </div>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition" />
    </Link>
  );
}

/** Inline SVG line chart of resume score over time (oldest → newest). */
function TrendChart({ history }: { history: HistoryEntry[] }) {
  const [hover, setHover] = useState<number | null>(null);

  // history is newest-first → reverse for chronological order
  const points = [...history].reverse().slice(-12);
  const W = 800;
  const H = 200;
  const PAD_X = 24;
  const PAD_Y = 24;

  if (points.length < 2) {
    return (
      <div className="mt-5 glass rounded-2xl p-8 text-center">
        <p className="text-sm text-muted-foreground">
          {points.length === 0
            ? "No analyses yet — your score trend will appear here once you run a few."
            : "Run at least one more analysis to see your score trend over time."}
        </p>
      </div>
    );
  }

  const xs = points.map(
    (_, i) => PAD_X + (i * (W - PAD_X * 2)) / Math.max(1, points.length - 1),
  );
  const ys = points.map((p) => {
    const v = p.analysis.resumeScore;
    return PAD_Y + ((100 - v) / 100) * (H - PAD_Y * 2);
  });

  const linePath = xs
    .map((x, i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${ys[i]!.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L ${xs[xs.length - 1]} ${H - PAD_Y} L ${xs[0]} ${H - PAD_Y} Z`;

  return (
    <div className="mt-5">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-48">
        <defs>
          <linearGradient id="trend-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="50%" stopColor="#e879f9" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="trend-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* gridlines */}
        {[0, 25, 50, 75, 100].map((g) => {
          const y = PAD_Y + ((100 - g) / 100) * (H - PAD_Y * 2);
          return (
            <g key={g}>
              <line
                x1={PAD_X}
                x2={W - PAD_X}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.06"
                strokeDasharray="2 4"
              />
              <text x={4} y={y + 3} fontSize="9" fill="currentColor" fillOpacity="0.35">
                {g}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill="url(#trend-area)" />
        <path
          d={linePath}
          fill="none"
          stroke="url(#trend-line)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: "drop-shadow(0 0 8px rgba(167,139,250,0.55))",
          }}
        />

        {xs.map((x, i) => {
          const y = ys[i]!;
          const p = points[i]!;
          const active = hover === i;
          return (
            <g
              key={p.id}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }}
            >
              <circle cx={x} cy={y} r={active ? 6 : 4} fill="#0b0a16" stroke="url(#trend-line)" strokeWidth="2" />
              {active && (
                <g>
                  <rect
                    x={Math.min(W - 130, Math.max(PAD_X, x - 60))}
                    y={Math.max(4, y - 48)}
                    width="120"
                    height="38"
                    rx="8"
                    fill="rgba(11,10,22,0.92)"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <text
                    x={Math.min(W - 130, Math.max(PAD_X, x - 60)) + 8}
                    y={Math.max(4, y - 48) + 15}
                    fontSize="10"
                    fill="rgba(255,255,255,0.95)"
                  >
                    Score {p.analysis.resumeScore} · ATS {p.analysis.atsScore}
                  </text>
                  <text
                    x={Math.min(W - 130, Math.max(PAD_X, x - 60)) + 8}
                    y={Math.max(4, y - 48) + 30}
                    fontSize="9"
                    fill="rgba(255,255,255,0.55)"
                  >
                    {new Date(p.createdAt).toLocaleDateString()}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

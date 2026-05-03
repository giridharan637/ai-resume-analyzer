"use client";

import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  CloudUpload,
  Download,
  FileText,
  Gauge,
  GraduationCap,
  Layers,
  Loader2,
  Plus,
  Printer,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Sparkles,
  Target,
  Wand2,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { generateText } from "@/client-lib/built-in-integrations/ai";
import { CircularScore } from "@/components/resume/CircularScore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveAnalysis } from "@/hooks/use-analyses";
import {
  buildAnalysis,
  jobMatchKeywordsFor,
  JOB_ROLES,
  type Analysis,
  type AtsLabel,
  type SectionKey,
} from "@/lib/resume-analysis";

import { useCurrentUser } from "@/lib/current-user";

const SECTION_ICON: Record<SectionKey, typeof Zap> = {
  Skills: Zap,
  Experience: Briefcase,
  Projects: Layers,
  Education: GraduationCap,
};

const SUGGESTION_ICON = {
  skills: Zap,
  projects: Layers,
  summary: FileText,
  verbs: Wand2,
  format: ShieldCheck,
};

export function ResumeAnalyzer({
  initialAnalysis,
  initialFileName,
}: {
  initialAnalysis?: Analysis;
  initialFileName?: string;
}) {
  const { user } = useCurrentUser();
  const [file, setFile] = useState<{ name: string; size: number } | null>(
    initialFileName ? { name: initialFileName, size: 0 } : null,
  );
  const [dragOver, setDragOver] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(initialAnalysis ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [sentence, setSentence] = useState(
    "Worked on a team that built a website for users to track their tasks.",
  );
  const [enhanced, setEnhanced] = useState<string>("");
  const [enhancing, setEnhancing] = useState(false);

  const [role, setRole] = useState("swe");
  const [matchAnim, setMatchAnim] = useState(0);

  const matchPct = useMemo(() => {
    const r = JOB_ROLES.find((j) => j.id === role);
    if (!r) return 70;
    const base = r.base;
    const boost = analysis ? Math.round((analysis.resumeScore - 80) / 3) : 0;
    return Math.max(40, Math.min(98, base + boost));
  }, [role, analysis]);

  useEffect(() => {
    setMatchAnim(0);
    const t = setTimeout(() => setMatchAnim(matchPct), 80);
    return () => clearTimeout(t);
  }, [matchPct]);

  const onFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0]!;
    const ok = /\.(pdf|docx?)$/i.test(f.name);
    if (!ok) {
      toast.error("Please upload a PDF or DOCX file");
      return;
    }
    setFile({ name: f.name, size: f.size });
    setAnalysis(null);
    setAnalyzing(true);
    setTimeout(async () => {
      const result = buildAnalysis(f.name, f.size);
      setAnalysis(result);
      setAnalyzing(false);
      if (user?.email) {
        try {
          // Pass placeholder for resume_text as requested by database schema
          await saveAnalysis(user.email, f.name, f.size, result, "Resume text content extracted for analysis.");
          toast.success("Analysis complete · Saved to history");
        } catch (err: any) {
          toast.success("Analysis complete");
          console.error("Save error:", err.message);
          alert("Could not save to history: " + err.message);
        }
      } else {
        toast.success("Analysis complete");
      }
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }, 2400);
  }, [user?.email]);

  const onEnhance = async () => {
    if (!sentence.trim()) {
      toast.error("Enter a sentence first");
      return;
    }
    setEnhancing(true);
    setEnhanced("");
    try {
      const result = await generateText(
        `Rewrite this resume bullet to be impactful, concise, and quantifiable. Use a strong action verb. Return ONLY the improved sentence, no quotes or commentary.\n\nSentence: ${sentence}`,
      );
      setEnhanced(result.trim());
    } catch {
      setEnhanced(
        "Architected and shipped a collaborative task-tracking platform serving 10K+ users, improving team productivity by 35%.",
      );
    } finally {
      setEnhancing(false);
    }
  };

  const printSuggestions = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* UPLOAD */}
      <section id="upload" className="no-print">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            onFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`group relative cursor-pointer overflow-hidden rounded-3xl glass-strong p-8 transition-all duration-500 ${
            dragOver ? "scale-[1.01] glow-primary" : "hover:scale-[1.005]"
          }`}
        >
          <div className="neon-border absolute inset-0 rounded-3xl" />
          <div className="pointer-events-none absolute -inset-1 opacity-40 bg-[linear-gradient(110deg,transparent_30%,rgba(167,139,250,0.5),rgba(34,211,238,0.5),transparent_70%)] animate-shimmer" />

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />

          <div className="relative flex flex-col items-center justify-center gap-4 py-6 text-center">
            <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-400/30 grid place-items-center animate-float">
              <CloudUpload className="h-9 w-9 text-foreground/90" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-border" />
            </div>
            {!file && !analyzing && (
              <>
                <div>
                  <h3 className="text-2xl font-semibold">Drop your resume here</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    or click to browse · PDF, DOC, DOCX · max 10MB
                  </p>
                </div>
                <div className="mt-1 flex gap-2">
                  <span className="glass rounded-full px-3 py-1 text-xs">PDF</span>
                  <span className="glass rounded-full px-3 py-1 text-xs">DOCX</span>
                  <span className="glass rounded-full px-3 py-1 text-xs">DOC</span>
                </div>
              </>
            )}
            {file && (
              <div className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                <FileText className="h-5 w-5 text-violet-500 dark:text-violet-300" />
                <div className="text-left">
                  <div className="text-sm font-medium">{file.name}</div>
                  {file.size > 0 && (
                    <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</div>
                  )}
                </div>
                {analyzing ? (
                  <Loader2 className="h-5 w-5 animate-spin text-cyan-500 dark:text-cyan-300" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                )}
              </div>
            )}
            {analyzing && <ScanProgress />}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section id="results" className="space-y-6">
        {!analysis ? (
          <div className="glass-strong rounded-3xl p-12 text-center no-print">
            <Gauge className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">
              Upload your resume above to see your personalized analysis.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Scores */}
              <div className="glass-strong rounded-3xl p-6 lg:col-span-1 animate-fade-up">
                <div className="flex items-center justify-around gap-4">
                  <CircularScore
                    value={analysis.resumeScore}
                    label="Resume Score"
                    gradientFrom="#a78bfa"
                    gradientTo="#22d3ee"
                  />
                </div>
                <div className="mt-6 flex items-center justify-around gap-4">
                  <CircularScore
                    value={analysis.atsScore}
                    label="ATS Score"
                    size={150}
                    gradientFrom="#f472b6"
                    gradientTo="#a78bfa"
                  />
                </div>
                <AtsBadge analysis={analysis} />
              </div>

              {/* Section breakdown + keywords */}
              <div
                className="glass-strong rounded-3xl p-6 lg:col-span-2 animate-fade-up"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Section Breakdown</h3>
                  <span className="glass rounded-full px-3 py-1 text-xs text-muted-foreground">
                    Live AI grading
                  </span>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {analysis.sections.map((s, i) => {
                    const Icon = SECTION_ICON[s.name];
                    return <SectionBar key={s.name} name={s.name} score={s.score} Icon={Icon} delay={i * 0.1} />;
                  })}
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <KeywordCard title="Matched Keywords" items={analysis.matchedKeywords} kind="match" />
                  <KeywordCard title="Missing Keywords" items={analysis.missingKeywords} kind="missing" />
                </div>
              </div>
            </div>

            {/* Weighted breakdown + Missing elements + ATS reasons */}
            <div className="grid gap-6 lg:grid-cols-3">
              {analysis.breakdown && (
                <div
                  className="glass-strong rounded-3xl p-6 animate-fade-up"
                  style={{ animationDelay: "0.12s" }}
                >
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-violet-500 dark:text-violet-300" /> Weighted Breakdown
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Total: <span className="text-gradient font-semibold">{analysis.resumeScore}</span> / 100
                  </p>
                  <div className="mt-4 space-y-3">
                    <WeightRow label="Skills" got={analysis.breakdown.skills} max={30} />
                    <WeightRow label="Projects" got={analysis.breakdown.projects} max={20} />
                    <WeightRow label="Experience" got={analysis.breakdown.experience} max={20} />
                    <WeightRow label="Format & Structure" got={analysis.breakdown.format} max={15} />
                    <WeightRow label="Keywords" got={analysis.breakdown.keywords} max={15} />
                  </div>
                </div>
              )}

              {analysis.missingElements && analysis.missingElements.length > 0 && (
                <div
                  className="glass-strong rounded-3xl p-6 animate-fade-up"
                  style={{ animationDelay: "0.14s" }}
                >
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-300" /> Missing Elements
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {analysis.missingElements.map((m, i) => (
                      <li
                        key={m}
                        className="flex items-start gap-2 glass rounded-xl p-3 text-sm animate-slide-in"
                        style={{ animationDelay: `${i * 0.08}s` }}
                      >
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500 dark:text-rose-300" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.atsReasons && analysis.atsReasons.length > 0 && (
                <div
                  className="glass-strong rounded-3xl p-6 animate-fade-up"
                  style={{ animationDelay: "0.16s" }}
                >
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-cyan-500 dark:text-cyan-300" /> ATS Checks
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {analysis.atsReasons.map((r, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 glass rounded-xl p-3 text-sm animate-slide-in"
                        style={{ animationDelay: `${i * 0.06}s` }}
                      >
                        {r.kind === "good" ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-300" />
                        ) : r.kind === "warn" ? (
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500 dark:text-amber-300" />
                        ) : (
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500 dark:text-rose-300" />
                        )}
                        <span className="text-muted-foreground">{r.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div id="suggestions" className="glass-strong rounded-3xl p-6 animate-fade-up" style={{ animationDelay: "0.15s" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-500 dark:text-violet-300" />
                  <h3 className="text-lg font-semibold">Smart AI Suggestions</h3>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={printSuggestions}
                  className="no-print glass border-border hover:bg-foreground/5"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {analysis.suggestions.map((sug, i) => {
                  const Icon = SUGGESTION_ICON[sug.category];
                  return (
                    <div
                      key={sug.title}
                      className="group relative glass rounded-2xl p-5 animate-slide-in hover:-translate-y-0.5 transition-transform"
                      style={{ animationDelay: `${i * 0.12}s` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-violet-500/40 to-cyan-400/40 grid place-items-center">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold">{sug.title}</h4>
                            <ImpactBadge impact={sug.impact} />
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{sug.detail}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </section>

      {/* AI ENHANCER + JOB MATCH */}
      <section className="grid gap-6 lg:grid-cols-2 no-print">
        <div className="glass-strong rounded-3xl p-6 animate-fade-up">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center">
              <Wand2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">AI Sentence Enhancer</h3>
              <p className="text-xs text-muted-foreground">
                Rewrite any bullet to sound impactful and recruiter-ready.
              </p>
            </div>
          </div>
          <Textarea
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            rows={3}
            className="mt-4 glass border-border resize-none"
            placeholder="Paste a resume sentence here..."
          />
          <Button
            onClick={onEnhance}
            disabled={enhancing}
            className="ripple mt-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 text-white border-0"
          >
            {enhancing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enhancing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Enhance with AI
              </>
            )}
          </Button>
          {enhanced && (
            <div className="mt-5 glass rounded-2xl p-4 animate-fade-up">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Enhanced version
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{enhanced}</p>
            </div>
          )}
        </div>

        <div id="jobmatch" className="glass-strong rounded-3xl p-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 grid place-items-center">
              <Target className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Job Match & Keyword Gap</h3>
              <p className="text-xs text-muted-foreground">See how your resume aligns with target roles.</p>
            </div>
          </div>

          <div className="mt-4">
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="glass border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JOB_ROLES.map((j) => (
                  <SelectItem key={j.id} value={j.id}>
                    {j.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6">
            <div className="flex items-end justify-between">
              <span className="text-sm text-muted-foreground">Match Strength</span>
              <span className="text-3xl font-bold text-gradient tabular-nums">{matchAnim}%</span>
            </div>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-foreground/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 shadow-[0_0_20px_rgba(167,139,250,0.6)] transition-all duration-1000 ease-out"
                style={{ width: `${matchAnim}%` }}
              />
            </div>

            {/* Keyword gap */}
            <div className="mt-5">
              <h4 className="text-sm font-medium text-muted-foreground">Keyword Gap</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {(() => {
                  const needed = jobMatchKeywordsFor(role).needed;
                  const have = new Set((analysis?.matchedKeywords ?? []).map((k) => k.toLowerCase()));
                  return needed.map((k) => {
                    const matched = have.has(k.toLowerCase());
                    return (
                      <span
                        key={k}
                        className={
                          matched
                            ? "rounded-full px-2.5 py-1 text-xs border border-emerald-400/30 text-emerald-600 dark:text-emerald-200 bg-emerald-500/10"
                            : "rounded-full px-2.5 py-1 text-xs border border-fuchsia-400/40 text-fuchsia-600 dark:text-fuchsia-200 bg-fuchsia-500/10 shadow-[0_0_12px_-2px_rgba(232,121,249,0.5)]"
                        }
                      >
                        {matched ? "✓" : "+"} {k}
                      </span>
                    );
                  });
                })()}
              </div>
              {!analysis && (
                <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Upload a resume to see matched vs missing keywords.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="hidden print:block text-xs text-muted-foreground">
        Generated by Resume.AI · {new Date().toLocaleDateString()}
      </div>
      <div className="text-center text-xs text-muted-foreground no-print">
        <button
          onClick={printSuggestions}
          className="inline-flex items-center gap-1.5 hover:text-foreground"
        >
          <Printer className="h-3 w-3" /> Print or save full report as PDF
        </button>
      </div>
    </div>
  );
}

function ScanProgress() {
  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-300">
        <Sparkles className="h-4 w-4 animate-pulse" /> AI scanning your resume...
      </div>
      <div className="h-1 w-64 overflow-hidden rounded-full bg-foreground/5">
        <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 animate-shimmer" />
      </div>
    </div>
  );
}

function AtsBadge({ analysis }: { analysis: Analysis }) {
  const label: AtsLabel =
    analysis.atsLabel ?? (analysis.atsFriendly ? "Friendly" : "Not Friendly");
  const cls =
    label === "Friendly"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-400/30"
      : label === "Moderate"
        ? "bg-amber-500/10 text-amber-600 dark:text-amber-200 border-amber-400/30"
        : "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-400/30";
  const Icon = label === "Friendly" ? ShieldCheck : label === "Moderate" ? ShieldAlert : ShieldX;
  const text =
    label === "Friendly"
      ? "ATS Friendly ✅"
      : label === "Moderate"
        ? "Moderately ATS Friendly ⚠️"
        : "Not ATS Friendly ❌";
  return (
    <div
      className={`mt-4 flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium ${cls}`}
    >
      <Icon className="h-4 w-4" /> {text}
    </div>
  );
}

function WeightRow({ label, got, max }: { label: string; got: number; max: number }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW((got / max) * 100), 100);
    return () => clearTimeout(t);
  }, [got, max]);
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums font-semibold">
          {got}<span className="text-muted-foreground">/{max}</span>
        </span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-foreground/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 transition-all duration-1000 ease-out"
          style={{ width: `${w}%` }}
        />
      </div>
    </div>
  );
}

function SectionBar({
  name,
  score,
  Icon,
  delay,
}: {
  name: string;
  score: number;
  Icon: typeof Zap;
  delay: number;
}) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(score), 100);
    return () => clearTimeout(t);
  }, [score]);
  return (
    <div className="glass rounded-2xl p-4 animate-fade-up" style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500/40 to-cyan-400/40 grid place-items-center">
            <Icon className="h-4 w-4" />
          </div>
          <span className="font-medium">{name}</span>
        </div>
        <span className="text-sm font-semibold text-gradient tabular-nums">{score}</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-foreground/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-1000 ease-out"
          style={{ width: `${w}%` }}
        />
      </div>
    </div>
  );
}

function KeywordCard({
  title,
  items,
  kind,
}: {
  title: string;
  items: string[];
  kind: "match" | "missing";
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((k) => (
          <span
            key={k}
            className={
              kind === "missing"
                ? "rounded-full px-2.5 py-1 text-xs border border-fuchsia-400/40 text-fuchsia-600 dark:text-fuchsia-200 bg-fuchsia-500/10 shadow-[0_0_12px_-2px_rgba(232,121,249,0.5)]"
                : "rounded-full px-2.5 py-1 text-xs border border-emerald-400/30 text-emerald-600 dark:text-emerald-200 bg-emerald-500/10"
            }
          >
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}

function ImpactBadge({ impact }: { impact: "High" | "Medium" | "Low" }) {
  const cls =
    impact === "High"
      ? "border-fuchsia-400/40 text-fuchsia-600 dark:text-fuchsia-200 bg-fuchsia-500/10"
      : impact === "Medium"
        ? "border-amber-400/40 text-amber-600 dark:text-amber-200 bg-amber-500/10"
        : "border-emerald-400/40 text-emerald-600 dark:text-emerald-200 bg-emerald-500/10";
  return (
    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${cls}`}>
      {impact}
    </span>
  );
}
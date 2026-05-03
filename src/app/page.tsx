"use client";

import {
  ArrowRight,
  CloudUpload,
  Gauge,
  GitCompareArrows,
  Github,
  History,
  Linkedin,
  ShieldCheck,
  Sparkles,
  Target,
  Twitter,
  Wand2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { HeroIllustration } from "@/components/resume/HeroIllustration";
import { Navbar } from "@/components/resume/Navbar";
import { Particles } from "@/components/Particles";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Gauge,
    title: "AI Resume Score",
    desc: "An instant 0-100 score across structure, content, and impact — with section breakdowns.",
  },
  {
    icon: ShieldCheck,
    title: "ATS Compatibility",
    desc: "Find out if your resume passes Applicant Tracking Systems before recruiters see it.",
  },
  {
    icon: Sparkles,
    title: "Smart Suggestions",
    desc: "Personalized AI suggestions: missing skills, projects to add, action verbs, and more.",
  },
  {
    icon: Wand2,
    title: "Sentence Enhancer",
    desc: "Rewrite weak bullets into impactful, quantifiable, recruiter-ready statements.",
  },
  {
    icon: Target,
    title: "Job Match & Keyword Gap",
    desc: "Pick a target role and see your match percentage with the exact missing keywords.",
  },
  {
    icon: GitCompareArrows,
    title: "Version Comparison",
    desc: "Diff two resume versions side-by-side to track every improvement across iterations.",
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 grid-bg" aria-hidden />
      <div className="pointer-events-none fixed inset-0">
        <Particles />
      </div>

      <Navbar />

      {/* HERO */}
      <section id="hero" className="relative mx-auto max-w-7xl px-4 pt-10 pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-foreground/80">Powered by GPT-grade AI</span>
            </div>
            <h1 className="mt-5 text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight">
              <span className="text-gradient">AI Resume</span>
              <br />
              <span className="text-foreground">Analyzer</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground text-pretty">
              Analyze, Improve, and Optimize Your Resume Instantly. Get an AI-powered
              ATS score, smart suggestions, version comparison, and tailored job-match
              insights — all in one premium workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="ripple bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 hover:opacity-90 text-white border-0 glow-primary"
              >
                <Link href="/dashboard">
                  <CloudUpload className="mr-2 h-4 w-4" />
                  Open Dashboard
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="glass border-border hover:bg-foreground/5"
              >
                <Link href="#features">
                  Explore features
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { v: "98%", l: "ATS pass rate" },
                { v: "12K+", l: "Resumes scored" },
                { v: "<3s", l: "Avg analysis" },
              ].map((s) => (
                <div key={s.l} className="glass rounded-xl px-3 py-3 text-center">
                  <div className="text-xl font-bold text-gradient">{s.v}</div>
                  <div className="text-[11px] text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative mx-auto max-w-7xl px-4 pb-20">
        <div className="flex flex-col items-center text-center animate-fade-up">
          <span className="glass rounded-full px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
            Features
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            Everything you need to <span className="text-gradient">land the interview</span>
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            A premium AI workspace built around resume optimization.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group relative glass-strong rounded-2xl p-6 hover:-translate-y-1 transition-transform animate-fade-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-500/40 to-cyan-400/40 grid place-items-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/0 group-hover:ring-foreground/10 transition" />
              </div>
            );
          })}
        </div>
      </section>

      {/* DEMO CTA */}
      <section id="upload" className="relative mx-auto max-w-7xl px-4 pb-20">
        <div className="relative overflow-hidden glass-strong rounded-3xl p-10 text-center animate-fade-up">
          <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-violet-500/30 to-cyan-400/30 blur-3xl animate-pulse-glow" />
          <div className="relative">
            <span className="glass rounded-full px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
              Try the demo
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              Ready to score your resume?
            </h2>
            <p className="mt-2 mx-auto max-w-xl text-muted-foreground">
              Jump into the workspace to analyze, compare, and optimize your resumes with AI.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="ripple bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 hover:opacity-90 text-white border-0 glow-primary"
              >
                <Link href="/dashboard/analyzer">
                  <CloudUpload className="mr-2 h-4 w-4" />
                  Go to Analyzer
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="glass border-border hover:bg-foreground/5">
                <Link href="/dashboard/history">
                  <History className="mr-2 h-4 w-4" /> View history
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* JOB MATCH TEASER */}
      <section id="jobmatch" className="relative mx-auto max-w-7xl px-4 pb-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-strong rounded-3xl p-6 animate-fade-up">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 grid place-items-center">
                <Target className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Job Match Engine</h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Pick a role like Software Developer, Data Analyst, or DevOps Engineer — see your real-time match
              percentage and the exact missing keywords to add.
            </p>
            <div className="mt-5 flex items-end justify-between">
              <span className="text-sm text-muted-foreground">Demo match</span>
              <span className="text-3xl font-bold text-gradient">87%</span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-foreground/5">
              <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 shadow-[0_0_20px_rgba(167,139,250,0.6)]" />
            </div>
          </div>
          <div className="glass-strong rounded-3xl p-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Built for speed</h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Drop a PDF or DOCX, get a complete report in under 3 seconds. Save every analysis, compare
              versions, and download your suggestions as a PDF.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { k: "Score", v: "92" },
                { k: "ATS", v: "88" },
                { k: "Match", v: "87%" },
              ].map((s) => (
                <div key={s.k} className="glass rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-gradient">{s.v}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-border mt-10">
        <div className="mx-auto max-w-7xl px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 grid place-items-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Resume.AI · Crafted with intelligence.
            </span>
          </div>
          <div className="flex items-center gap-2">
            {[Twitter, Github, Linkedin].map((Icon, i) => (
              <button
                key={i}
                className="h-9 w-9 grid place-items-center rounded-xl glass hover:bg-foreground/5 transition"
                aria-label="social"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="glass-strong flex w-full items-center justify-between rounded-2xl px-4 py-2.5">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2 group">
            <div className="relative h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 grid place-items-center glow-primary">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight">
              Resume<span className="text-gradient">.AI</span>
            </span>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {[
              { l: "Home", id: "hero" },
              { l: "Features", id: "features" },
              { l: "Demo", id: "upload" },
              { l: "Job Match", id: "jobmatch" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="rounded-lg px-3 py-1.5 text-sm text-foreground/75 hover:text-foreground hover:bg-foreground/5 transition-colors"
              >
                {item.l}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="hidden sm:inline-flex hover:bg-foreground/5"
            >
              <Link href="/login">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="ripple bg-gradient-to-r from-violet-500 to-cyan-400 hover:opacity-90 text-white border-0 shadow-[0_0_20px_-2px_rgba(167,139,250,0.6)]"
            >
              <Link href="/signup">
                Get started
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

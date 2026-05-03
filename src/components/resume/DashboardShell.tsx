"use client";

import {
  GitCompareArrows,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Particles } from "@/components/Particles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/lib/current-user";


const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/analyzer", label: "Analyzer", icon: Wand2 },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, ready } = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out");
      router.replace("/login");
    } catch {
      toast.error("Failed to sign out");
    }
  };


  if (!ready || !user) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="glass rounded-2xl px-6 py-4 text-sm text-muted-foreground">
          Loading workspace...
        </div>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-60" aria-hidden />
      <div className="pointer-events-none fixed inset-0 -z-0">
        <Particles />
      </div>

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <div className="m-3 h-[calc(100vh-1.5rem)] glass-strong rounded-2xl flex flex-col p-3">
            <Link href="/dashboard" className="flex items-center gap-2 px-2 py-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 grid place-items-center glow-primary">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold leading-none">
                  Resume<span className="text-gradient">.AI</span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  Premium workspace
                </div>
              </div>
            </Link>

            <nav className="mt-4 flex-1 space-y-1">
              {NAV.map((n) => {
                const active =
                  pathname === n.href || (n.href !== "/dashboard" && pathname.startsWith(n.href));
                const Icon = n.icon;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setMobileOpen(false)}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                      active
                        ? "bg-gradient-to-r from-violet-500/20 to-cyan-400/10 text-foreground"
                        : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-full bg-gradient-to-b from-violet-400 to-cyan-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
                    )}
                    <Icon className={`h-4 w-4 ${active ? "text-violet-300" : ""}`} />
                    <span>{n.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-border pt-3">
              <div className="flex items-center gap-2 rounded-xl glass p-2">
                <Avatar className="h-9 w-9">
                  {user.image ? (
                    <AvatarImage src={user.image} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-400 text-white text-xs">
                    {initials || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{user.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
                </div>
                <button
                  onClick={signOut}
                  className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {mobileOpen && (
          <button
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
        )}

        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-20 px-3 pt-3">
            <div className="glass-strong rounded-2xl flex items-center gap-3 px-4 py-2.5">
              <button
                className="lg:hidden rounded-lg p-1.5 hover:bg-foreground/5"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
              <div className="hidden md:flex items-center gap-2 flex-1 max-w-md rounded-xl bg-foreground/5 px-3 py-1.5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="Search resumes, suggestions..."
                />
              </div>
              <div className="flex-1 md:hidden" />
              <ThemeToggle />
              {user.image ? (
                <div className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-border">
                  <Image src={user.image} alt={user.name} width={32} height={32} />
                </div>
              ) : null}
            </div>
          </header>

          <div className="flex-1 px-3 py-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
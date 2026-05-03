"use client";

import { Bell, Lock, Moon, Palette, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useCurrentUser } from "@/lib/current-user";

export default function SettingsPage() {
  const { user } = useCurrentUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notify, setNotify] = useState(true);
  const [animations, setAnimations] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="animate-fade-up">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-gradient">Settings</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Customize your workspace.</p>
      </div>

      {/* Profile */}
      <div className="glass-strong rounded-3xl p-6 animate-fade-up">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold">Profile</h3>
        </div>

        <div className="mt-5 glass rounded-2xl p-4 flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 grid place-items-center text-white font-semibold text-lg overflow-hidden">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              (user?.name?.[0] ?? "U").toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-base font-semibold truncate">{user?.name ?? "—"}</div>
            <div className="text-sm text-muted-foreground truncate">{user?.email ?? "—"}</div>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5 mt-0.5 shrink-0 text-violet-300" />
          <span>
            Your profile is managed by your organization's identity provider and can't be edited here.
          </span>
        </div>
      </div>

      {/* Appearance */}
      <div className="glass-strong rounded-3xl p-6 animate-fade-up" style={{ animationDelay: "0.05s" }}>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 grid place-items-center">
            <Palette className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold">Appearance</h3>
        </div>

        <div className="mt-5 grid gap-3">
          <div className="glass rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 grid place-items-center">
                <Sun
                  className={`absolute h-5 w-5 transition-all duration-500 ${
                    isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100 text-amber-300"
                  }`}
                />
                <Moon
                  className={`absolute h-5 w-5 transition-all duration-500 ${
                    isDark ? "opacity-100 rotate-0 scale-100 text-cyan-300" : "opacity-0 -rotate-90 scale-50"
                  }`}
                />
              </div>
              <div>
                <div className="text-sm font-medium">Theme</div>
                <div className="text-xs text-muted-foreground">Switch between dark and light</div>
              </div>
            </div>
            <Switch checked={isDark} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
          </div>

          <div className="glass rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Animations</div>
              <div className="text-xs text-muted-foreground">Enable smooth transitions and micro-interactions</div>
            </div>
            <Switch checked={animations} onCheckedChange={setAnimations} />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-strong rounded-3xl p-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 grid place-items-center">
            <Bell className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
        <div className="mt-5 glass rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Analysis alerts</div>
            <div className="text-xs text-muted-foreground">Toast me when an analysis completes</div>
          </div>
          <Switch checked={notify} onCheckedChange={setNotify} />
        </div>
      </div>
    </div>
  );
}

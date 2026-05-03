"use client";

import { ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Particles } from "@/components/Particles";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

// Helper to log errors only in development without triggering Next.js overlay
const logDevError = (...args: any[]) => {
  if (process.env.NODE_ENV === "development") {
    // We use console.log instead of console.error to avoid the "1 issue" overlay
    console.log("[Auth Debug]:", ...args);
  }
};

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focus, setFocus] = useState<string | null>(null);

  // UI Errors
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [formError, setFormError] = useState("");

  const validateEmail = (val: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(val.trim());
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // Reset errors
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmError("");
    setFormError("");

    let isValid = true;

    // 1. Frontend Validation
    if (!name.trim()) {
      setNameError("Full name is required");
      isValid = false;
    }
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Enter a valid email address");
      isValid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }
    if (password !== confirm) {
      setConfirmError("Passwords do not match");
      isValid = false;
    }

    if (!isValid) return;

    setSubmitting(true);

    try {
      // 2. Supabase Signup
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (authError) {
        logDevError("Signup failed", authError.message);
        setFormError(authError.message);
        alert(authError.message);
        setSubmitting(false);
        return;
      }

      if (data.user) {
        // 3. Prevent duplicate insert by checking existing user by email
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("email", email.trim())
          .single();

        if (!existingUser) {
          // 4. Insert user into "users" table
          const { error: dbErr } = await supabase.from("users").insert([
            { 
              id: data.user.id, 
              email: email.trim(), 
              name: name.trim(),
              created_at: new Date().toISOString()
            }
          ]);

          if (dbErr) {
            logDevError("DB Sync error", dbErr.message);
            alert("Database Error: " + dbErr.message);
          }
        }

        if (data.session) {
          toast.success("Account created successfully!");
          router.push("/dashboard");
          router.refresh();
        } else {
          toast.success("Account created! Please check your email for verification.");
          router.push("/login");
        }
      }
    } catch (err: any) {
      logDevError("Unexpected signup exception", err);
      const errMsg = err?.message || "A connection error occurred. Please try again.";
      setFormError(errMsg);
      alert(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-10">
      <div className="pointer-events-none fixed inset-0 grid-bg" aria-hidden />
      <div className="pointer-events-none fixed inset-0">
        <Particles />
      </div>
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="auth-wave h-[140vmin] w-[140vmin] animate-spin-slow rounded-full opacity-70" />
      </div>
      <FloatingShapes />

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        <div className="relative">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-cyan-400/40 via-violet-500/40 to-fuchsia-500/40 blur-xl animate-pulse-glow" />
          <form
            onSubmit={onSubmit}
            noValidate
            className="relative glass-strong neon-border rounded-3xl p-8 backdrop-blur-2xl"
          >
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 grid place-items-center shadow-[0_0_30px_rgba(96,165,250,0.6)]">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
                Resume.AI
              </span>
            </div>

            <h1 className="mt-6 text-3xl font-bold tracking-tight">
              Create <span className="text-gradient">your account</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Start analyzing resumes with the AI workspace.
            </p>

            <div className="mt-7 space-y-4">
              <GlowField
                id="name"
                label="Full Name"
                icon={<User className="h-4 w-4" />}
                type="text"
                value={name}
                error={nameError}
                onChange={(v) => {
                  setName(v);
                  if (nameError) setNameError("");
                }}
                focused={focus === "name"}
                onFocus={() => setFocus("name")}
                onBlur={() => setFocus(null)}
                placeholder="Ada Lovelace"
                autoComplete="name"
              />
              <GlowField
                id="email"
                label="Email"
                icon={<Mail className="h-4 w-4" />}
                type="email"
                value={email}
                error={emailError}
                onChange={(v) => {
                  setEmail(v);
                  if (emailError) setEmailError("");
                }}
                focused={focus === "email"}
                onFocus={() => setFocus("email")}
                onBlur={() => setFocus(null)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              <div className="relative">
                <GlowField
                  id="password"
                  label="Password"
                  icon={<Lock className="h-4 w-4" />}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  error={passwordError}
                  onChange={(v) => {
                    setPassword(v);
                    if (passwordError) setPasswordError("");
                  }}
                  focused={focus === "password"}
                  onFocus={() => setFocus("password")}
                  onBlur={() => setFocus(null)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="relative">
                <GlowField
                  id="confirm"
                  label="Confirm Password"
                  icon={<Lock className="h-4 w-4" />}
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  error={confirmError}
                  onChange={(v) => {
                    setConfirm(v);
                    if (confirmError) setConfirmError("");
                  }}
                  focused={focus === "confirm"}
                  onFocus={() => setFocus("confirm")}
                  onBlur={() => setFocus(null)}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-9 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {formError && (
              <div className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 animate-fade-up">
                {formError}
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting || !name || !email || !password || !confirm}
              className="ripple mt-7 w-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 text-white border-0 glow-primary hover:opacity-90 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
              size="lg"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating...
                </div>
              ) : (
                <>
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-gradient font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-5 text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

function GlowField(props: {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between items-center px-0.5">
        <label htmlFor={props.id} className="text-xs uppercase tracking-wider text-muted-foreground">
          {props.label}
        </label>
        {props.error && (
          <span className="text-[10px] font-medium text-rose-400 animate-fade-in">
            {props.error}
          </span>
        )}
      </div>
      <div
        className={`relative rounded-xl transition-all duration-300 ${
          props.error
            ? "shadow-[0_0_0_1px_rgba(244,63,94,0.6)]"
            : props.focused
            ? "shadow-[0_0_0_1px_rgba(167,139,250,0.7),0_0_30px_-5px_rgba(167,139,250,0.6)]"
            : "shadow-[0_0_0_1px_rgba(120,120,120,0.1)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
        }`}
      >
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {props.icon}
        </div>
        <input
          id={props.id}
          type={props.type}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          placeholder={props.placeholder}
          autoComplete={props.autoComplete}
          className={`w-full rounded-xl bg-foreground/5 dark:bg-white/[0.03] py-3 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors ${
            props.error ? "text-rose-200" : ""
          }`}
        />
      </div>
    </div>
  );
}

function FloatingShapes() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-50">
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl animate-blob" />
      <div
        className="absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl animate-blob"
        style={{ animationDelay: "4s" }}
      />
    </div>
  );
}

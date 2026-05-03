"use client";

import { Eye, FileText, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ResumeAnalyzer } from "@/components/resume/ResumeAnalyzer";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/lib/current-user";
import { useAnalyses, deleteAnalysis, clearAnalyses } from "@/hooks/use-analyses";
import { type HistoryEntry, type Analysis } from "@/lib/resume-analysis";

/**
 * Safely parses the analysis data which could be a JSON string or already an object
 */
function getSafeAnalysis(data: any): Analysis | null {
  if (!data) return null;
  if (typeof data === "object" && data.resumeScore !== undefined) {
    return data as Analysis;
  }
  try {
    const str = typeof data === "string" ? data : JSON.stringify(data);
    const parsed = JSON.parse(str);
    return parsed as Analysis;
  } catch (e) {
    console.error("Analysis parse error:", e);
    return null;
  }
}

export default function HistoryPage() {
  const { user } = useCurrentUser();
  const { data: history, isLoading } = useAnalyses(user?.email);
  const [selected, setSelected] = useState<HistoryEntry | null>(null);

  // VIEW DETAILS PAGE (Internal State View)
  if (selected) {
    const analysis = getSafeAnalysis(selected.analysis);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {selected.fileName || "Untitled Analysis"}
            </h1>
            <p className="text-xs text-muted-foreground">
              Analyzed {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "Unknown date"}
            </p>
          </div>
          <Button variant="outline" className="glass border-border" onClick={() => setSelected(null)}>
            ← Back to history
          </Button>
        </div>
        
        {!analysis ? (
          <div className="glass-strong rounded-3xl p-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">Detailed analysis data is unavailable.</p>
            {selected.analysis && (
              <pre className="mt-4 p-4 glass rounded-xl text-left text-xs overflow-auto max-h-96 text-muted-foreground">
                {typeof selected.analysis === "string" ? selected.analysis : JSON.stringify(selected.analysis, null, 2)}
              </pre>
            )}
          </div>
        ) : (
          <ResumeAnalyzer initialAnalysis={analysis} initialFileName={selected.fileName || "Resume"} />
        )}
      </div>
    );
  }

  const analyses = history || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Analysis <span className="text-gradient">History</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            All your past resume analyses, securely stored to your account.
          </p>
        </div>
        {analyses.length > 0 && user?.email && (
          <Button
            variant="outline"
            size="sm"
            className="glass border-border hover:bg-foreground/5"
            onClick={async () => {
              if (confirm("Are you sure you want to clear your entire history?")) {
                await clearAnalyses(user.email);
                toast.success("History cleared");
              }
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear all
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="glass-strong rounded-3xl p-12 text-center animate-fade-up">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground/60" />
          <p className="mt-4 text-sm text-muted-foreground">Loading your history...</p>
        </div>
      ) : analyses.length === 0 ? (
        <div className="glass-strong rounded-3xl p-12 text-center animate-fade-up">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground font-medium">No history found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Run your first analysis from the Analyzer page to see it here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {analyses.map((h, i) => {
            const analysis = getSafeAnalysis(h.analysis);
            const fileName = h.fileName || "Untitled Analysis";
            
            return (
              <div
                key={h.id}
                className="group glass-strong rounded-2xl p-5 animate-fade-up hover:-translate-y-0.5 transition-transform"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500/40 to-cyan-400/40 grid place-items-center shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{fileName}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {h.createdAt ? new Date(h.createdAt).toLocaleString() : "Unknown date"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      if (!user?.email) return;
                      await deleteAnalysis(user.email, h.id);
                      toast.success("Removed");
                    }}
                    className="opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-muted-foreground hover:text-rose-300 hover:bg-rose-500/10 transition"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Mini label="Resume" value={analysis?.resumeScore ?? 0} />
                  <Mini label="ATS" value={analysis?.atsScore ?? 0} />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  {(analysis?.sections || []).map((s) => (
                    <div key={s.name} className="text-[11px]">
                      <div className="flex justify-between text-muted-foreground">
                        <span>{s.name}</span>
                        <span>{s.score}</span>
                      </div>
                      <div className="h-1 rounded-full bg-foreground/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                          style={{ width: `${s.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4 w-full glass border-border hover:bg-foreground/5"
                  onClick={() => setSelected(h)}
                >
                  <Eye className="mr-2 h-4 w-4" /> View full report
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="glass rounded-xl p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-xl font-bold text-gradient tabular-nums">{value || 0}</div>
    </div>
  );
}

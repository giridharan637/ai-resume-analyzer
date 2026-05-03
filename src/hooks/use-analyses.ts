"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { type Analysis, type HistoryEntry } from "@/lib/resume-analysis";

// Simple global refresh system to mimic SWR mutate
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export function useAnalyses(userEmail: string | undefined | null) {
  const [data, setData] = useState<HistoryEntry[] | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const l = () => setRefreshCount((c) => c + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  useEffect(() => {
    if (!userEmail) {
      setData(undefined);
      return;
    }

    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { data: rows, error: fetchErr } = await supabase
          .from("analyses")
          .select("*")
          .eq("user_email", userEmail)
          .order("created_at", { ascending: false });

        if (!isMounted) return;

        if (fetchErr) {
          console.error("Supabase Fetch Error:", fetchErr.message);
          alert("Failed to load history: " + fetchErr.message);
          setError(new Error(fetchErr.message));
        } else {
          // Map snake_case to camelCase
          const entries: HistoryEntry[] = (rows || []).map((r: any) => ({
            id: r.id,
            fileName: r.file_name,
            fileSize: r.file_size,
            createdAt: new Date(r.created_at).getTime(),
            analysis: r.analysis,
          }));
          setData(entries);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Unexpected fetch error:", err);
          setError(err);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [userEmail, refreshCount]);

  return { data, error, isLoading };
}

export async function saveAnalysis(
  userEmail: string,
  fileName: string,
  fileSize: number,
  analysis: Analysis,
  resumeText: string = "",
): Promise<HistoryEntry> {
  try {
    const { data, error } = await supabase
      .from("analyses")
      .insert([
        {
          user_email: userEmail,
          file_name: fileName,
          file_size: fileSize,
          analysis: analysis,
          score: analysis.resumeScore,
          resume_text: resumeText,
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase Insert Error:", error.message);
      alert("Failed to save analysis: " + error.message);
      throw new Error(error.message);
    }

    notify();
    
    // Map back to camelCase
    return {
      id: data.id,
      fileName: data.file_name,
      fileSize: data.file_size,
      createdAt: new Date(data.created_at).getTime(),
      analysis: data.analysis,
    };
  } catch (err: any) {
    console.error("saveAnalysis exception:", err);
    throw err;
  }
}

export async function deleteAnalysis(userEmail: string, id: string) {
  try {
    const { error } = await supabase
      .from("analyses")
      .delete()
      .eq("id", id)
      .eq("user_email", userEmail);

    if (error) {
      console.error("Supabase Delete Error:", error.message);
      alert("Failed to delete: " + error.message);
      throw new Error(error.message);
    }
    notify();
  } catch (err: any) {
    console.error("deleteAnalysis exception:", err);
    throw err;
  }
}

export async function clearAnalyses(userEmail: string) {
  try {
    const { error } = await supabase
      .from("analyses")
      .delete()
      .eq("user_email", userEmail);

    if (error) {
      console.error("Supabase Clear Error:", error.message);
      alert("Failed to clear history: " + error.message);
      throw new Error(error.message);
    }
    notify();
  } catch (err: any) {
    console.error("clearAnalyses exception:", err);
    throw err;
  }
}

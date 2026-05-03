"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/client-lib/api-client";
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
    setIsLoading(true);

    apiClient
      .get<HistoryEntry[]>(`/analyses?userEmail=${encodeURIComponent(userEmail)}`)
      .then((res) => {
        if (isMounted) setData(res.data);
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

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
): Promise<HistoryEntry> {
  const { data } = await apiClient.post<HistoryEntry>("/analyses", {
    userEmail,
    fileName,
    fileSize,
    analysis,
  });
  notify();
  return data;
}

export async function deleteAnalysis(userEmail: string, id: string) {
  await apiClient.delete(`/analyses/${id}?userEmail=${encodeURIComponent(userEmail)}`);
  notify();
}

export async function clearAnalyses(userEmail: string) {
  await apiClient.delete(`/analyses?userEmail=${encodeURIComponent(userEmail)}`);
  notify();
}

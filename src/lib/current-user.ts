"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { type User } from "@supabase/supabase-js";

export type CurrentUser = {
  name: string;
  email: string;
  image?: string;
};

export function useCurrentUser(): { user: CurrentUser | null; ready: boolean } {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialUser = async () => {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      if (supabaseUser) {
        setUser({
          name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split("@")[0] || "User",
          email: supabaseUser.email || "",
          image: supabaseUser.user_metadata?.avatar_url || undefined,
        });
      } else {
        setUser(null);
      }
      setReady(true);
    };

    getInitialUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
          email: session.user.email || "",
          image: session.user.user_metadata?.avatar_url || undefined,
        });
      } else {
        setUser(null);
      }
      setReady(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, ready };
}

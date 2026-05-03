import { createClient as createBrowserClient } from "./supabase/client";

/**
 * Standard Supabase client for client-side usage.
 * This is a singleton instance for use in "use client" components.
 */
export const supabase = createBrowserClient();

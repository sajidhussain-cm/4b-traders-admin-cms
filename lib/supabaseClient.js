"use client";
import { createBrowserClient } from "@supabase/ssr";

// Single browser client, safe to import anywhere in client components.
// Only the URL + anon (public) key are used here — never the service role key.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

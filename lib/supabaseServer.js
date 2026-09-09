import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server-side client used in Server Components / middleware so the
// logged-in admin's session cookie is respected when RLS checks run.
export function createServerSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set() {
          // no-op in Server Components; middleware handles refresh
        },
        remove() {},
      },
    }
  );
}

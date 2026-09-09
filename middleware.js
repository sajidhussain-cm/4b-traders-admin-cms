import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Redirects to /admin/login if there's no Supabase session at all.
// This is a UX convenience only — the real security boundary is
// Postgres Row Level Security (see supabase/schema.sql), which checks
// the logged-in user against admin_users on every query regardless of
// what this middleware does.
export async function middleware(request) {
  const response = NextResponse.next();

  if (!request.nextUrl.pathname.startsWith("/admin")) return response;
  if (request.nextUrl.pathname === "/admin/login") return response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value; },
        set(name, value, options) { response.cookies.set(name, value, options); },
        remove(name, options) { response.cookies.set(name, "", { ...options, maxAge: 0 }); },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};

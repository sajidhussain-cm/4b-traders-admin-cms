"use client";
import { useEffect, useState } from "react";
import { createClient } from "./supabaseClient";

// Client-side hook: is there a logged-in Supabase user AND are they
// present in admin_users? Both the login page and every admin page
// use this so a random authenticated (non-admin) account can't get in.
export function useAdminSession() {
  const [state, setState] = useState({ loading: true, isAdmin: false, user: null });

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (active) setState({ loading: false, isAdmin: false, user: null });
        return;
      }
      const { data: adminRow } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();
      if (active) setState({ loading: false, isAdmin: !!adminRow, user });
    }
    check();

    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  return state;
}

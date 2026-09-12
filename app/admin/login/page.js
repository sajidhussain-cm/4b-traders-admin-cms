"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { createClient } from "../../../lib/supabaseClient";
import { useAdminSession } from "../../../lib/useAdmin";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");

  const router = useRouter();
  const { loading: sessionLoading, isAdmin } = useAdminSession();

  // Already an admin? Redirect after render.
  useEffect(() => {
    if (!sessionLoading && isAdmin) {
      router.replace("/admin");
    }
  }, [sessionLoading, isAdmin, router]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Confirm this account is actually an admin.
    const { data: adminRow, error: adminError } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    console.log("LOGIN USER:", data.user.id);
    console.log("ADMIN ROW:", adminRow);
    console.log("ADMIN ERROR:", adminError);

    if (adminError) {
      toast.error("Unable to verify admin access.");
      setLoading(false);
      return;
    }

    if (!adminRow) {
      await supabase.auth.signOut();
      toast.error("This account does not have admin access.");
      setLoading(false);
      return;
    }

    toast.success("Welcome back!");

    router.push("/admin");
  }

  async function handleResetRequest(e) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/admin/login`
          : undefined,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      "If that email has an account, a reset link has been sent."
    );

    setMode("login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal px-4">
      <div className="w-full max-w-sm bg-cream rounded-lg shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="font-serif text-2xl text-maroon">
            4B Traders
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Admin Dashboard
          </p>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="admin-label">Email</label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
                placeholder="owner@4btraders.com"
              />
            </div>

            <div>
              <label className="admin-label">Password</label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Login"}
            </button>

            <button
              type="button"
              onClick={() => setMode("reset")}
              className="text-xs text-maroon underline block mx-auto mt-2"
            >
              Forgot password?
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter your admin email and we'll send a password reset link.
            </p>

            <div>
              <label className="admin-label">Email</label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
                placeholder="owner@4btraders.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>

            <button
              type="button"
              onClick={() => setMode("login")}
              className="text-xs text-maroon underline block mx-auto mt-2"
            >
              Back to login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
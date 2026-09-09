"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "../../../lib/supabaseClient";

const FIELDS = [
  { key: "instagram", label: "Instagram URL" },
  { key: "facebook", label: "Facebook URL" },
  { key: "tiktok", label: "TikTok URL" },
  { key: "youtube", label: "YouTube URL" },
  { key: "linkedin", label: "LinkedIn URL" },
];

export default function AdminSocialPage() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.from("website_settings").select("*").eq("id", 1).maybeSingle();
      if (error) toast.error(error.message);
      if (data) setForm(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const payload = Object.fromEntries(FIELDS.map((f) => [f.key, form[f.key] || ""]));
    const { error } = await supabase.from("website_settings").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", 1);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Social links updated — the footer and social icons will use these automatically.");
  }

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-1">Social Links</h1>
      <p className="text-sm text-gray-500 mb-6">Leave a field blank to hide that icon on the public site.</p>

      <form onSubmit={handleSave} className="admin-card max-w-xl space-y-4">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="admin-label">{f.label}</label>
            <input className="admin-input" value={form[f.key] || ""} placeholder="https://..." onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
          </div>
        ))}
        <button type="submit" disabled={saving} className="btn-primary text-sm px-4 py-2 disabled:opacity-50">
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

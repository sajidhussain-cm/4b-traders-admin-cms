"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "../../../lib/supabaseClient";

const FIELDS = [
  { key: "whatsapp", label: "WhatsApp Number", placeholder: "+92 300 1234567" },
  { key: "phone", label: "Phone Number", placeholder: "+92 42 1234567" },
  { key: "email", label: "Email", placeholder: "info@4btraders.com" },
  { key: "address", label: "Address", placeholder: "Shop #, Street, City" },
  { key: "business_hours", label: "Business Hours", placeholder: "Mon–Sat, 10am–8pm" },
  { key: "google_maps_link", label: "Google Maps Link", placeholder: "https://maps.google.com/..." },
];

export default function AdminContactPage() {
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
    toast.success("Contact information updated — the site footer and contact page will use these values.");
  }

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-1">Contact Information</h1>
      <p className="text-sm text-gray-500 mb-6">These values are stored in the database and loaded dynamically — nothing is hardcoded in the site.</p>

      <form onSubmit={handleSave} className="admin-card max-w-xl space-y-4">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="admin-label">{f.label}</label>
            {f.key === "address" ? (
              <textarea className="admin-input" rows={2} value={form[f.key] || ""} placeholder={f.placeholder} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
            ) : (
              <input className="admin-input" value={form[f.key] || ""} placeholder={f.placeholder} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
            )}
          </div>
        ))}
        <button type="submit" disabled={saving} className="btn-primary text-sm px-4 py-2 disabled:opacity-50">
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

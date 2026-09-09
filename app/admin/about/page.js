"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "../../../lib/supabaseClient";
import ImageUpload from "../../../components/ImageUpload";

export default function AdminAboutPage() {
  const [form, setForm] = useState({ heading: "", description: "", image: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.from("about_content").select("*").eq("id", 1).maybeSingle();
      if (error) toast.error(error.message);
      if (data) setForm({ heading: data.heading || "", description: data.description || "", image: data.image || "" });
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("about_content").update({
      heading: form.heading, description: form.description, image: form.image, updated_at: new Date().toISOString(),
    }).eq("id", 1);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("About page updated");
  }

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-1">About Us</h1>
      <p className="text-sm text-gray-500 mb-6">Edit the story shown on the public About page.</p>

      <form onSubmit={handleSave} className="admin-card max-w-2xl space-y-4">
        <div>
          <label className="admin-label">About Heading</label>
          <input className="admin-input" value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} />
        </div>
        <div>
          <label className="admin-label">Business Story / Description</label>
          <textarea className="admin-input" rows={8} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Tell customers about 4B Traders — your story, craftsmanship, and values." />
        </div>
        <div>
          <label className="admin-label">About Image</label>
          <ImageUpload onUploaded={(url) => setForm({ ...form, image: url })} />
          {form.image && <img src={form.image} className="w-full max-w-sm aspect-video object-cover rounded mt-2" />}
        </div>
        <button type="submit" disabled={saving} className="btn-primary text-sm px-4 py-2 disabled:opacity-50">
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

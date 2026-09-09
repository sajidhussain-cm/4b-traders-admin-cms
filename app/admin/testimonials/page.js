"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "../../../lib/supabaseClient";
import ImageUpload from "../../../components/ImageUpload";
import ConfirmDialog from "../../../components/ConfirmDialog";

const empty = { id: null, customer_name: "", review: "", rating: 5, photo: "", active: true };

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function edit(t) { setForm(t); }
  function resetForm() { setForm(empty); }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.customer_name.trim() || !form.review.trim()) { toast.error("Customer name and review are required"); return; }
    setSaving(true);
    const supabase = createClient();
    const payload = { customer_name: form.customer_name.trim(), review: form.review.trim(), rating: form.rating, photo: form.photo, active: form.active };
    const { error } = form.id
      ? await supabase.from("testimonials").update(payload).eq("id", form.id)
      : await supabase.from("testimonials").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(form.id ? "Testimonial updated" : "Testimonial added");
    resetForm();
    load();
  }

  async function toggleActive(t) {
    const supabase = createClient();
    const { error } = await supabase.from("testimonials").update({ active: !t.active }).eq("id", t.id);
    if (error) { toast.error(error.message); return; }
    load();
  }

  async function handleDelete(id) {
    const supabase = createClient();
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    setConfirmId(null);
    if (error) { toast.error(error.message); return; }
    toast.success("Testimonial deleted");
    load();
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-6">Testimonials</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <form onSubmit={handleSave} className="admin-card space-y-4 h-fit">
          <h2 className="font-medium text-charcoal">{form.id ? "Edit Testimonial" : "Add Testimonial"}</h2>
          <div>
            <label className="admin-label">Customer Name</label>
            <input className="admin-input" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} required />
          </div>
          <div>
            <label className="admin-label">Review Text</label>
            <textarea className="admin-input" rows={4} value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} required />
          </div>
          <div>
            <label className="admin-label">Rating</label>
            <select className="admin-input" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} star{r > 1 ? "s" : ""}</option>)}
            </select>
          </div>
          <div>
            <label className="admin-label">Photo (optional)</label>
            <ImageUpload onUploaded={(url) => setForm({ ...form, photo: url })} />
            {form.photo && <img src={form.photo} className="w-16 h-16 rounded-full object-cover mt-2" />}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Enabled (shown on site)
          </label>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary text-sm px-4 py-2 disabled:opacity-50">
              {saving ? "Saving…" : form.id ? "Save Changes" : "Add Testimonial"}
            </button>
            {form.id && <button type="button" onClick={resetForm} className="btn-outline text-sm px-4 py-2">Cancel</button>}
          </div>
        </form>

        <div className="md:col-span-2 space-y-3">
          {loading ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-400">No testimonials yet. Add real customer reviews here — avoid fake ones.</p>
          ) : (
            items.map((t) => (
              <div key={t.id} className="admin-card flex gap-3">
                {t.photo ? <img src={t.photo} className="w-12 h-12 rounded-full object-cover shrink-0" /> : <div className="w-12 h-12 rounded-full bg-gray-100 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-charcoal">{t.customer_name}</p>
                    <span className="text-xs text-amber-500">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{t.review}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <button onClick={() => toggleActive(t)} className={t.active ? "text-green-600 underline" : "text-gray-400 underline"}>
                      {t.active ? "Enabled" : "Disabled"}
                    </button>
                    <button onClick={() => edit(t)} className="text-maroon underline">Edit</button>
                    <button onClick={() => setConfirmId(t.id)} className="text-red-600 underline">Delete</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmDialog open={!!confirmId} title="Are you sure you want to delete this testimonial?" onCancel={() => setConfirmId(null)} onConfirm={() => handleDelete(confirmId)} />
    </div>
  );
}

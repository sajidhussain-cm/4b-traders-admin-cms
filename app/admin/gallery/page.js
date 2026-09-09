"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "../../../lib/supabaseClient";
import ImageUpload from "../../../components/ImageUpload";
import ConfirmDialog from "../../../components/ConfirmDialog";

export default function AdminGalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.from("gallery").select("*").order("sort_order").order("created_at");
    if (error) toast.error(error.message);
    setItems(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleUpload(urls) {
    const supabase = createClient();
    const list = Array.isArray(urls) ? urls : [urls];
    const startOrder = items.length;
    const rows = list.map((image, i) => ({ image, sort_order: startOrder + i, active: true }));
    const { error } = await supabase.from("gallery").insert(rows);
    if (error) { toast.error(error.message); return; }
    toast.success(`${list.length} image(s) added`);
    load();
  }

  async function updateCaption(id, caption) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, caption } : it)));
  }

  async function saveCaption(id, caption) {
    const supabase = createClient();
    const { error } = await supabase.from("gallery").update({ caption }).eq("id", id);
    if (error) toast.error(error.message);
  }

  async function toggleActive(id, active) {
    const supabase = createClient();
    const { error } = await supabase.from("gallery").update({ active }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, active } : it)));
  }

  async function move(index, dir) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setItems(reordered);
    const supabase = createClient();
    await Promise.all(reordered.map((it, i) => supabase.from("gallery").update({ sort_order: i }).eq("id", it.id)));
  }

  async function handleDelete(id) {
    const supabase = createClient();
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    setConfirmId(null);
    if (error) { toast.error(error.message); return; }
    toast.success("Image removed from gallery");
    load();
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-1">Gallery</h1>
      <p className="text-sm text-gray-500 mb-6">Upload and manage the images shown on the public gallery page.</p>

      <div className="admin-card mb-6">
        <label className="admin-label">Upload Gallery Images</label>
        <ImageUpload multiple onUploaded={handleUpload} />
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400">No gallery images yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it, i) => (
            <div key={it.id} className="admin-card p-3 space-y-2">
              <img src={it.image} className="w-full aspect-square object-cover rounded" />
              <input
                className="admin-input text-xs"
                placeholder="Caption (optional)"
                value={it.caption || ""}
                onChange={(e) => updateCaption(it.id, e.target.value)}
                onBlur={(e) => saveCaption(it.id, e.target.value)}
              />
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" checked={it.active} onChange={(e) => toggleActive(it.id, e.target.checked)} />
                  Visible
                </label>
                <div className="flex gap-2">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="disabled:opacity-30" aria-label="Move up">↑</button>
                  <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="disabled:opacity-30" aria-label="Move down">↓</button>
                  <button onClick={() => setConfirmId(it.id)} className="text-red-600 underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!confirmId} title="Are you sure you want to delete this image?" onCancel={() => setConfirmId(null)} onConfirm={() => handleDelete(confirmId)} />
    </div>
  );
}

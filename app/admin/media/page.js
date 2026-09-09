"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "../../../lib/supabaseClient";
import ImageUpload from "../../../components/ImageUpload";
import ConfirmDialog from "../../../components/ConfirmDialog";

export default function AdminMediaPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmName, setConfirmName] = useState(null);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.storage.from("media").list("", { sortBy: { column: "created_at", order: "desc" } });
    if (error) toast.error(error.message);
    setFiles((data || []).filter((f) => f.name !== ".emptyFolderPlaceholder"));
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function publicUrl(name) {
    const supabase = createClient();
    return supabase.storage.from("media").getPublicUrl(name).data.publicUrl;
  }

  function copyUrl(name) {
    navigator.clipboard.writeText(publicUrl(name));
    toast.success("Image URL copied");
  }

  async function handleDelete(name) {
    const supabase = createClient();
    const { error } = await supabase.storage.from("media").remove([name]);
    setConfirmName(null);
    if (error) { toast.error(error.message); return; }
    toast.success("File deleted");
    load();
  }

  const filtered = files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-1">Media Library</h1>
      <p className="text-sm text-gray-500 mb-6">Every image uploaded anywhere in the admin panel lands here too. Upload standalone files (banners, extras) directly.</p>

      <div className="admin-card mb-4 flex flex-wrap items-center gap-4 justify-between">
        <ImageUpload multiple onUploaded={() => load()} />
        <input className="admin-input max-w-xs" placeholder="Search files…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400">No files found.</p>
      ) : (
        <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((f) => (
            <div key={f.name} className="admin-card p-2 space-y-2">
              <img src={publicUrl(f.name)} className="w-full aspect-square object-cover rounded bg-gray-50" />
              <p className="text-xs text-gray-500 truncate" title={f.name}>{f.name}</p>
              <div className="flex justify-between text-xs">
                <button onClick={() => copyUrl(f.name)} className="text-maroon underline">Copy URL</button>
                <button onClick={() => setConfirmName(f.name)} className="text-red-600 underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!confirmName} title="Are you sure you want to delete this file? It may still be referenced elsewhere on the site." onCancel={() => setConfirmName(null)} onConfirm={() => handleDelete(confirmName)} />
    </div>
  );
}

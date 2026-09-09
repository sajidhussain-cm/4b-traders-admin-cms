"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "../../../lib/supabaseClient";
import ImageUpload from "../../../components/ImageUpload";
import ConfirmDialog from "../../../components/ConfirmDialog";

const empty = { id: null, name: "", description: "", image: "", active: true };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.from("categories").select("*").order("name");
    if (error) toast.error(error.message);
    setCategories(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function edit(cat) { setForm(cat); }
  function resetForm() { setForm(empty); }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Category name is required"); return; }
    setSaving(true);
    const supabase = createClient();
    const payload = { name: form.name.trim(), description: form.description, image: form.image, active: form.active };
    const { error } = form.id
      ? await supabase.from("categories").update(payload).eq("id", form.id)
      : await supabase.from("categories").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(form.id ? "Category updated" : "Category added");
    resetForm();
    load();
  }

  async function handleDelete(id) {
    const supabase = createClient();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    setConfirmId(null);
    if (error) { toast.error(error.message); return; }
    toast.success("Category deleted");
    load();
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-6">Categories</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <form onSubmit={handleSave} className="admin-card space-y-4 h-fit">
          <h2 className="font-medium text-charcoal">{form.id ? "Edit Category" : "Add Category"}</h2>
          <div>
            <label className="admin-label">Name</label>
            <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="admin-label">Description</label>
            <textarea className="admin-input" rows={3} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="admin-label">Image</label>
            <ImageUpload onUploaded={(url) => setForm({ ...form, image: url })} />
            {form.image && <img src={form.image} className="w-full aspect-video object-cover rounded mt-2" />}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Active
          </label>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary text-sm px-4 py-2 disabled:opacity-50">
              {saving ? "Saving…" : form.id ? "Save Changes" : "Add Category"}
            </button>
            {form.id && <button type="button" onClick={resetForm} className="btn-outline text-sm px-4 py-2">Cancel</button>}
          </div>
        </form>

        <div className="md:col-span-2 admin-card p-0 overflow-x-auto">
          {loading ? (
            <p className="text-sm text-gray-400 p-5">Loading…</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-gray-400 p-5">No categories yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr><th className="p-3">Image</th><th className="p-3">Name</th><th className="p-3">Status</th><th className="p-3"></th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td className="p-3"><div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">{c.image && <img src={c.image} className="w-full h-full object-cover" />}</div></td>
                    <td className="p-3 font-medium text-charcoal">{c.name}</td>
                    <td className="p-3 text-xs">{c.active ? <span className="text-green-600">Active</span> : <span className="text-gray-400">Inactive</span>}</td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <button onClick={() => edit(c)} className="text-maroon underline mr-3">Edit</button>
                      <button onClick={() => setConfirmId(c.id)} className="text-red-600 underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmDialog open={!!confirmId} title="Are you sure you want to delete this category?" onCancel={() => setConfirmId(null)} onConfirm={() => handleDelete(confirmId)} />
    </div>
  );
}

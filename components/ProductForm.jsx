"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "../lib/supabaseClient";
import ImageUpload from "./ImageUpload";

const emptyProduct = {
  name: "", description: "", price: "", sale_price: "", category_id: "",
  sku: "", sizes: "", colors: "", stock: "0", images: [],
  featured: false, new_arrival: false, active: true,
};

export default function ProductForm({ productId }) {
  const isEdit = !!productId;
  const [form, setForm] = useState(emptyProduct);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: cats } = await supabase.from("categories").select("id, name").order("name");
      setCategories(cats || []);

      if (isEdit) {
        const { data, error } = await supabase.from("products").select("*").eq("id", productId).single();
        if (error) { toast.error(error.message); setLoading(false); return; }
        setForm({
          ...data,
          price: String(data.price ?? ""),
          sale_price: data.sale_price != null ? String(data.sale_price) : "",
          stock: String(data.stock ?? "0"),
          sizes: (data.sizes || []).join(", "),
          colors: (data.colors || []).join(", "),
          images: data.images || [],
        });
        setLoading(false);
      }
    }
    load();
  }, [isEdit, productId]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleImagesUploaded(urls) {
    const list = Array.isArray(urls) ? urls : [urls];
    setForm((f) => ({ ...f, images: [...f.images, ...list] }));
  }

  function removeImage(idx) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  }

  function setPrimary(idx) {
    setForm((f) => {
      const imgs = [...f.images];
      const [chosen] = imgs.splice(idx, 1);
      return { ...f, images: [chosen, ...imgs] };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Product name is required"); return; }
    setSaving(true);
    const supabase = createClient();

    const payload = {
      name: form.name.trim(),
      description: form.description,
      price: parseFloat(form.price) || 0,
      sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
      category_id: form.category_id || null,
      sku: form.sku,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      stock: parseInt(form.stock, 10) || 0,
      images: form.images,
      featured: form.featured,
      new_arrival: form.new_arrival,
      active: form.active,
      updated_at: new Date().toISOString(),
    };

    const { error } = isEdit
      ? await supabase.from("products").update(payload).eq("id", productId)
      : await supabase.from("products").insert(payload);

    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(isEdit ? "Changes saved" : "Product added");
    router.push("/admin/products");
  }

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="admin-card space-y-4">
          <div>
            <label className="admin-label">Product Name</label>
            <input className="admin-input" value={form.name} onChange={(e) => update("name", e.target.value)} required />
          </div>
          <div>
            <label className="admin-label">Description</label>
            <textarea className="admin-input" rows={5} value={form.description || ""} onChange={(e) => update("description", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Price (Rs.)</label>
              <input type="number" step="0.01" min="0" className="admin-input" value={form.price} onChange={(e) => update("price", e.target.value)} required />
            </div>
            <div>
              <label className="admin-label">Sale Price (Rs.)</label>
              <input type="number" step="0.01" min="0" className="admin-input" value={form.sale_price} onChange={(e) => update("sale_price", e.target.value)} placeholder="Optional" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Category</label>
              <select className="admin-input" value={form.category_id || ""} onChange={(e) => update("category_id", e.target.value)}>
                <option value="">— None —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="admin-label">SKU</label>
              <input className="admin-input" value={form.sku || ""} onChange={(e) => update("sku", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Sizes (comma separated)</label>
              <input className="admin-input" value={form.sizes} onChange={(e) => update("sizes", e.target.value)} placeholder="e.g. 36, 37, 38, 39, 40" />
            </div>
            <div>
              <label className="admin-label">Colors (comma separated)</label>
              <input className="admin-input" value={form.colors} onChange={(e) => update("colors", e.target.value)} placeholder="e.g. Maroon, Gold, Black" />
            </div>
          </div>
          <div>
            <label className="admin-label">Stock Quantity</label>
            <input type="number" min="0" className="admin-input max-w-[160px]" value={form.stock} onChange={(e) => update("stock", e.target.value)} />
          </div>
        </div>

        <div className="admin-card">
          <label className="admin-label">Product Images</label>
          <ImageUpload multiple onUploaded={handleImagesUploaded} />
          {form.images.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {form.images.map((url, idx) => (
                <div key={url} className="relative group">
                  <img src={url} className={`w-full aspect-square object-cover rounded border-2 ${idx === 0 ? "border-gold" : "border-transparent"}`} />
                  {idx === 0 && <span className="absolute top-1 left-1 bg-gold text-charcoal text-[10px] px-1.5 py-0.5 rounded">Primary</span>}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {idx !== 0 && (
                      <button type="button" onClick={() => setPrimary(idx)} className="text-white text-xs underline">Set primary</button>
                    )}
                    <button type="button" onClick={() => removeImage(idx)} className="text-red-300 text-xs underline">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="admin-card space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
            Featured Product
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.new_arrival} onChange={(e) => update("new_arrival", e.target.checked)} />
            New Arrival
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => update("active", e.target.checked)} />
            Active (visible on website)
          </label>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-50">
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Product"}
        </button>
      </div>
    </form>
  );
}

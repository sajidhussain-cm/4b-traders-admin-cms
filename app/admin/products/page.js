"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { createClient } from "../../../lib/supabaseClient";
import ConfirmDialog from "../../../components/ConfirmDialog";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, name, price, sale_price, sku, stock, images, active, featured, category_id, categories(name)")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setProducts(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    setConfirmId(null);
    if (error) { toast.error(error.message); return; }
    toast.success("Product deleted");
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Products</h1>
          <p className="text-sm text-gray-500">{products.length} total</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary text-sm px-4 py-2">+ Add Product</Link>
      </div>

      <input
        placeholder="Search by name or SKU…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="admin-input mb-4 max-w-sm"
      />

      <div className="admin-card overflow-x-auto p-0">
        {loading ? (
          <p className="text-sm text-gray-400 p-5">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400 p-5">No products found. Add your first product to get started.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="p-3">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                      {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-charcoal">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.sku}</p>
                  </td>
                  <td className="p-3 text-gray-500">{p.categories?.name || "—"}</td>
                  <td className="p-3">
                    {p.sale_price ? (
                      <span>Rs. {p.sale_price} <span className="line-through text-gray-400 ml-1">Rs. {p.price}</span></span>
                    ) : (
                      <span>Rs. {p.price}</span>
                    )}
                  </td>
                  <td className="p-3">{p.stock <= 5 ? <span className="text-red-600 font-medium">{p.stock}</span> : p.stock}</td>
                  <td className="p-3">
                    <div className="flex flex-col gap-0.5 text-xs">
                      <span className={p.active ? "text-green-600" : "text-gray-400"}>{p.active ? "Active" : "Inactive"}</span>
                      {p.featured && <span className="text-gold">Featured</span>}
                    </div>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <Link href={`/admin/products/${p.id}`} className="text-maroon underline mr-3">Edit</Link>
                    <button onClick={() => setConfirmId(p.id)} className="text-red-600 underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmId}
        title="Are you sure you want to delete this product?"
        onCancel={() => setConfirmId(null)}
        onConfirm={() => handleDelete(confirmId)}
      />
    </div>
  );
}

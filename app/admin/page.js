"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabaseClient";

function StatCard({ label, value, accent }) {
  return (
    <div className="admin-card">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-serif mt-1 ${accent || "text-charcoal"}`}>{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [
        { count: totalProducts },
        { count: newOrders },
        { count: totalCustomers },
        { count: lowStock },
        { data: orders },
        { data: products },
      ] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "Pending"),
        supabase.from("customers").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }).lt("stock", 5),
        supabase.from("orders").select("id, status, total, created_at, customers(name)").order("created_at", { ascending: false }).limit(5),
        supabase.from("products").select("id, name, price, stock, images").order("created_at", { ascending: false }).limit(5),
      ]);
      setStats({ totalProducts, newOrders, totalCustomers, lowStock });
      setRecentOrders(orders || []);
      setRecentProducts(products || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">Live overview of your 4B Traders store.</p>

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Products" value={stats.totalProducts ?? 0} />
            <StatCard label="New Orders" value={stats.newOrders ?? 0} accent="text-maroon" />
            <StatCard label="Total Customers" value={stats.totalCustomers ?? 0} />
            <StatCard label="Low Stock Products" value={stats.lowStock ?? 0} accent={stats.lowStock > 0 ? "text-red-600" : "text-charcoal"} />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="admin-card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-medium text-charcoal">Recent Orders</h2>
                <Link href="/admin/orders" className="text-xs text-maroon underline">View all</Link>
              </div>
              {recentOrders.length === 0 ? (
                <p className="text-sm text-gray-400">No orders yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100 text-sm">
                  {recentOrders.map((o) => (
                    <li key={o.id} className="py-2 flex justify-between">
                      <span>{o.customers?.name || "Guest"} — Rs. {o.total}</span>
                      <span className="text-xs text-gray-500">{o.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="admin-card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-medium text-charcoal">Recently Added Products</h2>
                <Link href="/admin/products" className="text-xs text-maroon underline">View all</Link>
              </div>
              {recentProducts.length === 0 ? (
                <p className="text-sm text-gray-400">No products yet — add your first one.</p>
              ) : (
                <ul className="divide-y divide-gray-100 text-sm">
                  {recentProducts.map((p) => (
                    <li key={p.id} className="py-2 flex justify-between">
                      <span>{p.name}</span>
                      <span className="text-xs text-gray-500">Rs. {p.price} · stock {p.stock}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="admin-card">
            <h2 className="font-medium text-charcoal mb-3">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/products/new" className="btn-primary text-sm px-4 py-2">Add Product</Link>
              <Link href="/admin/homepage" className="btn-outline text-sm px-4 py-2">Edit Homepage</Link>
              <Link href="/admin/orders" className="btn-outline text-sm px-4 py-2">View Orders</Link>
              <Link href="/admin/media" className="btn-outline text-sm px-4 py-2">Media Library</Link>
            </div>
            <p className="text-xs text-gray-400 mt-4">Website status: connected to Supabase — all data here is live.</p>
          </div>
        </>
      )}
    </div>
  );
}

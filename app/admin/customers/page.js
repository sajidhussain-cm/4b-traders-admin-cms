"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "../../../lib/supabaseClient";

export default function AdminCustomersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const supabase = createClient();
      const [{ data: customers, error: cErr }, { data: orders, error: oErr }] = await Promise.all([
        supabase.from("customers").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("customer_id, total, created_at"),
      ]);
      if (cErr) toast.error(cErr.message);
      if (oErr) toast.error(oErr.message);

      const byCustomer = {};
      (orders || []).forEach((o) => {
        if (!o.customer_id) return;
        if (!byCustomer[o.customer_id]) byCustomer[o.customer_id] = { count: 0, total: 0, last: null };
        byCustomer[o.customer_id].count += 1;
        byCustomer[o.customer_id].total += Number(o.total || 0);
        if (!byCustomer[o.customer_id].last || o.created_at > byCustomer[o.customer_id].last) {
          byCustomer[o.customer_id].last = o.created_at;
        }
      });

      const merged = (customers || [])
        .filter((c) => byCustomer[c.id]) // only customers who have placed orders
        .map((c) => ({ ...c, stats: byCustomer[c.id] }));
      setRows(merged);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = rows.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || (c.phone || "").includes(search)
  );

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-1">Customers</h1>
      <p className="text-sm text-gray-500 mb-6">Customers who have placed at least one order.</p>

      <div className="admin-card mb-4">
        <input className="admin-input max-w-xs" placeholder="Search by name or phone…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="admin-card p-0 overflow-x-auto">
        {loading ? (
          <p className="text-sm text-gray-400 p-5">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400 p-5">No customers yet. They'll appear here once orders start coming in.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Orders</th>
                <th className="p-3">Total Spent</th>
                <th className="p-3">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td className="p-3 font-medium text-charcoal">{c.name}</td>
                  <td className="p-3">{c.phone}</td>
                  <td className="p-3 text-gray-500">{c.email || "—"}</td>
                  <td className="p-3">{c.stats.count}</td>
                  <td className="p-3">Rs. {c.stats.total.toLocaleString()}</td>
                  <td className="p-3 text-gray-500">{new Date(c.stats.last).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

"use client";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "../../../lib/supabaseClient";

const STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_COLOR = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Processing: "bg-indigo-100 text-indigo-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("All");

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, customers(name, phone, address)")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setOrders(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    const supabase = createClient();
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Order status updated");
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-1">Orders</h1>
      <p className="text-sm text-gray-500 mb-6">{orders.length} total orders</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {["All", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full border ${filter === s ? "bg-maroon text-cream border-maroon" : "border-gray-300 text-gray-600"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="admin-card p-0 overflow-x-auto">
        {loading ? (
          <p className="text-sm text-gray-400 p-5">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400 p-5">No orders in this view yet. Orders placed on the public site will appear here.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((o) => (
                <Fragment key={o.id}>
                  <tr>
                    <td className="p-3 font-mono text-xs text-gray-500">{o.id.slice(0, 8)}</td>
                    <td className="p-3">
                      <p className="font-medium text-charcoal">{o.customers?.name || "Guest"}</p>
                      <p className="text-xs text-gray-400">{o.customers?.phone}</p>
                    </td>
                    <td className="p-3">Rs. {o.total}</td>
                    <td className="p-3 text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="p-3">
                      <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}
                        className={`text-xs rounded-full px-2 py-1 border-0 ${STATUS_COLOR[o.status] || "bg-gray-100"}`}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="text-maroon underline text-xs">
                        {expanded === o.id ? "Hide" : "Details"}
                      </button>
                    </td>
                  </tr>
                  {expanded === o.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="p-4">
                        <p className="text-xs text-gray-500 mb-2">Address: {o.customers?.address || "—"}</p>
                        <ul className="text-xs space-y-1">
                          {(o.items || []).map((item, i) => (
                            <li key={i}>{item.qty}× {item.name} {item.size ? `(Size ${item.size})` : ""} {item.color ? `— ${item.color}` : ""} — Rs. {item.price}</li>
                          ))}
                        </ul>
                        <p className="text-xs text-gray-500 mt-2">Subtotal: Rs. {o.subtotal} · Total: Rs. {o.total}</p>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

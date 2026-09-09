"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { useCart } from "../../components/CartContext";
import { createClient } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [placing, setPlacing] = useState(false);
  const router = useRouter();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  async function placeOrder(e) {
    e.preventDefault();
    if (items.length === 0) return toast.error("Your cart is empty");
    if (!form.name || !form.phone || !form.address) return toast.error("Please fill in name, phone and address");

    setPlacing(true);
    const supabase = createClient();

    // Real writes: this creates rows in `customers` and `orders` — the
    // admin dashboard's Orders and Customers pages read directly from
    // these same tables.
    const { data: customer, error: custErr } = await supabase
      .from("customers")
      .insert({ name: form.name, phone: form.phone, email: form.email, address: form.address })
      .select()
      .single();

    if (custErr) { toast.error("Could not save your details: " + custErr.message); setPlacing(false); return; }

    const { error: orderErr } = await supabase.from("orders").insert({
      customer_id: customer.id,
      items,
      subtotal,
      total: subtotal,
      status: "Pending",
    });

    setPlacing(false);
    if (orderErr) return toast.error("Could not place order: " + orderErr.message);

    toast.success("Order placed! We'll contact you shortly.");
    clearCart();
    router.push("/");
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="section-heading">Your Cart</h1>
        {items.length === 0 ? (
          <p className="text-gray-500 mt-6">Your cart is empty.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-10 mt-8">
            <div className="space-y-4">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between border-b border-gray-200 pb-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.size} {item.color} × {item.qty}</p>
                  </div>
                  <div className="text-right">
                    <p>Rs. {item.price * item.qty}</p>
                    <button onClick={() => removeItem(i)} className="text-xs text-red-500">Remove</button>
                  </div>
                </div>
              ))}
              <p className="font-serif text-xl text-maroon pt-4">Subtotal: Rs. {subtotal}</p>
            </div>

            <form onSubmit={placeOrder} className="admin-card space-y-4">
              <h2 className="font-serif text-xl text-maroon">Delivery Details</h2>
              <input className="admin-input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="admin-input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="admin-input" placeholder="Email (optional)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <textarea className="admin-input" placeholder="Delivery address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <button disabled={placing} className="btn-primary w-full">{placing ? "Placing order..." : "Place Order"}</button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

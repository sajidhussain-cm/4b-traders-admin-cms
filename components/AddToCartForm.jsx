"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "./CartContext";

export default function AddToCartForm({ product, whatsapp }) {
  const [size, setSize] = useState(product.sizes?.[0] || "");
  const [color, setColor] = useState(product.colors?.[0] || "");
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  function handleAdd() {
    addItem({
      product_id: product.id,
      name: product.name,
      size, color, qty,
      price: product.sale_price || product.price,
    });
    toast.success("Added to cart");
  }

  function handleWhatsAppOrder() {
    const price = product.sale_price || product.price;
    const msg = `Hi! I'd like to order:\n${product.name}${size ? ` (Size: ${size})` : ""}${color ? ` (Color: ${color})` : ""} x${qty}\nPrice: Rs. ${price * qty}`;
    const url = `https://wa.me/${whatsapp || ""}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }

  return (
    <div className="space-y-4">
      {product.sizes?.length > 0 && (
        <div>
          <label className="admin-label">Size</label>
          <select value={size} onChange={(e) => setSize(e.target.value)} className="admin-input">
            {product.sizes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}
      {product.colors?.length > 0 && (
        <div>
          <label className="admin-label">Color</label>
          <select value={color} onChange={(e) => setColor(e.target.value)} className="admin-input">
            {product.colors.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      )}
      <div>
        <label className="admin-label">Quantity</label>
        <input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value))} className="admin-input w-24" />
      </div>
      <div className="flex gap-3">
        <button onClick={handleAdd} className="btn-primary">Add to Cart</button>
        {whatsapp && <button onClick={handleWhatsAppOrder} className="btn-outline">Order via WhatsApp</button>}
      </div>
    </div>
  );
}

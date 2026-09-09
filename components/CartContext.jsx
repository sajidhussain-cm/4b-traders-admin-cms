"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = sessionStorage.getItem("4b-cart");
    if (saved) setItems(JSON.parse(saved));
  }, []);
  useEffect(() => {
    sessionStorage.setItem("4b-cart", JSON.stringify(items));
  }, [items]);

  function addItem(item) {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product_id === item.product_id && i.size === item.size && i.color === item.color
      );
      if (existing) {
        return prev.map((i) => (i === existing ? { ...i, qty: i.qty + item.qty } : i));
      }
      return [...prev, item];
    });
  }
  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }
  function clearCart() { setItems([]); }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

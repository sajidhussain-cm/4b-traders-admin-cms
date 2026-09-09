"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartContext";

export default function Navbar() {
  const { items } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const count = items.reduce((n, i) => n + i.qty, 0);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-gold/30">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center" onClick={closeMenu}>
          <img
            src="https://ongsdcjbupiqwlgtnvdm.supabase.co/storage/v1/object/public/media/1788892183287-Logo-of-4B.jpeg"
            alt="4B Traders"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex gap-8 text-sm tracking-wide text-charcoal">
          <Link href="/">Home</Link>
          <Link href="/products">Shop</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-maroon text-2xl"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          {/* CART */}
          <Link
            href="/cart"
            className="relative text-maroon font-medium"
          >
            Cart{" "}
            {count > 0 && (
              <span className="ml-1 text-xs bg-maroon text-cream rounded-full px-2 py-0.5">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <nav className="md:hidden border-t border-gold/30 bg-cream px-6 py-4">
          <div className="flex flex-col gap-4 text-charcoal">
            <Link href="/" onClick={closeMenu}>
              Home
            </Link>

            <Link href="/products" onClick={closeMenu}>
              Shop
            </Link>

            <Link href="/gallery" onClick={closeMenu}>
              Gallery
            </Link>

            <Link href="/about" onClick={closeMenu}>
              About
            </Link>

            <Link href="/contact" onClick={closeMenu}>
              Contact
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
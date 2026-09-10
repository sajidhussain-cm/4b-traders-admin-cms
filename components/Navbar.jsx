"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCart } from "./CartContext";

export default function Navbar() {
  const { items } = useCart();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [menuOpen, setMenuOpen] = useState(false);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const closeMenu = () => setMenuOpen(false);

  const menuItems = [
    { name: "NEW IN", href: "/products" },
    { name: "BRIDAL", href: "/products?style=Bridal" },
    { name: "EMBROIDERED", href: "/products?style=Embroidered" },
    { name: "CLASSIC", href: "/products?style=Classic" },
    { name: "FESTIVE", href: "/products?style=Festive" },
    { name: "LADIES", href: "/products?category=ladies" },
    { name: "KIDS", href: "/products?category=kids" },
    { name: "WHOLESALE", href: "/bulk" },
  ];

  const isActive = (item) => {
    if (item.name === "WHOLESALE") {
      return pathname === "/bulk";
    }

    if (item.name === "NEW IN") {
      return (
        pathname === "/products" &&
        !searchParams.get("style") &&
        !searchParams.get("category")
      );
    }

    if (item.name === "LADIES") {
      return (
        pathname === "/products" &&
        searchParams.get("category") === "ladies"
      );
    }

    if (item.name === "KIDS") {
      return (
        pathname === "/products" &&
        searchParams.get("category") === "kids"
      );
    }

    if (item.name === "BRIDAL") {
      return (
        pathname === "/products" &&
        searchParams.get("style") === "Bridal"
      );
    }

    if (item.name === "EMBROIDERED") {
      return (
        pathname === "/products" &&
        searchParams.get("style") === "Embroidered"
      );
    }

    if (item.name === "CLASSIC") {
      return (
        pathname === "/products" &&
        searchParams.get("style") === "Classic"
      );
    }

    if (item.name === "FESTIVE") {
      return (
        pathname === "/products" &&
        searchParams.get("style") === "Festive"
      );
    }

    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-gold/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="min-h-[82px] md:min-h-[92px] flex items-center justify-between gap-5">

          {/* LOGO */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center shrink-0 group"
          >
            <img
              src="https://ongsdcjbupiqwlgtnvdm.supabase.co/storage/v1/object/public/media/1788892183287-Logo-of-4B.jpeg"
              alt="4B Traders"
              className="h-14 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-3 lg:gap-5 xl:gap-7">
            {menuItems.map((item) => {
              const active = isActive(item);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group relative
                    py-4 px-1
                    text-[10px] lg:text-[11px] xl:text-xs
                    font-medium
                    tracking-[0.16em]
                    whitespace-nowrap
                    transition-all duration-300
                    ${
                      active
                        ? "text-[#4a1717]"
                        : "text-[#3b3530] hover:text-[#4a1717]"
                    }
                  `}
                >
                  <span className="relative z-10">
                    {item.name}
                  </span>

                  {/* ACTIVE / HOVER UNDERLINE */}
                  <span
                    className={`
                      absolute
                      left-1/2
                      -bottom-0.5
                      h-px
                      bg-[#a8875b]
                      transition-all duration-300
                      ${
                        active
                          ? "w-full -translate-x-1/2 opacity-100"
                          : "w-0 -translate-x-1/2 opacity-0 group-hover:w-full group-hover:opacity-100"
                      }
                    `}
                  />

                  {/* ACTIVE / HOVER DOT */}
                  <span
                    className={`
                      absolute
                      -bottom-2.5
                      left-1/2
                      w-1 h-1
                      rounded-full
                      bg-[#a8875b]
                      -translate-x-1/2
                      transition-all duration-300
                      ${
                        active
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }
                    `}
                  />
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">

            {/* SEARCH */}
            <Link
              href="/products"
              aria-label="Search products"
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-maroon hover:bg-white hover:shadow-sm transition-all duration-300"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>
            </Link>

            {/* CART */}
            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-maroon hover:bg-white hover:shadow-sm transition-all duration-300"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>

              {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-maroon text-cream text-[9px] flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            {/* MOBILE MENU */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center text-maroon text-xl"
              aria-label="Toggle menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <nav className="md:hidden border-t border-gold/30 bg-cream px-6 py-3 shadow-sm">
          <div className="flex flex-col">
            {menuItems.map((item) => {
              const active = isActive(item);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  className={`
                    relative
                    py-4
                    text-xs
                    font-medium
                    tracking-[0.16em]
                    border-b border-maroon/10
                    transition-all duration-300
                    ${
                      active
                        ? "text-[#4a1717] pl-3"
                        : "text-[#3b3530] hover:text-[#4a1717]"
                    }
                  `}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#a8875b]" />
                  )}

                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
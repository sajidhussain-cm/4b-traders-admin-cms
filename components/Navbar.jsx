"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCart } from "./CartContext";

function NavbarContent() {
  const { items } = useCart();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [menuOpen, setMenuOpen] = useState(false);

  const count = items.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

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

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#d8e9e6] shadow-sm">
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
          <nav className="hidden md:flex flex-1 items-center justify-center gap-2 lg:gap-3 xl:gap-4">
            {menuItems.map((item) => {
              const active = isActive(item);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    px-3 lg:px-3.5 xl:px-4
                    py-2.5
                    rounded-full
                    text-[10px] lg:text-[11px] xl:text-xs
                 font-medium
font-[Manrope]
tracking-[0.1em]
whitespace-nowrap
                    transition-all duration-300
                    ${
                      active
                        ? "bg-[#6FA9A2] text-white shadow-sm"
                        : "text-[#252525] hover:bg-[#E8F7F4] hover:text-[#5F9891]"
                    }
                  `}
                >
                  {item.name}
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
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-[#252525] hover:bg-[#E8F7F4] hover:text-[#6FA9A2] transition-all duration-300"
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
              className="relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-[#252525] hover:bg-[#E8F7F4] hover:text-[#6FA9A2] transition-all duration-300"
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
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#6FA9A2] text-white text-[9px] flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            {/* MOBILE MENU */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center text-[#252525] text-xl"
              aria-label="Toggle menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <nav className="md:hidden border-t border-[#d8e9e6] bg-white px-6 py-3 shadow-sm">
          <div className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const active = isActive(item);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  className={`
                    py-3.5 px-4
                    rounded-lg
                    text-xs
                    font-medium
                    tracking-[0.16em]
                    transition-all duration-300
                    ${
                      active
                        ? "bg-[#6FA9A2] text-white shadow-sm"
                        : "text-[#252525] hover:bg-[#E8F7F4] hover:text-[#5F9891]"
                    }
                  `}
                >
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

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "../lib/supabaseClient";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/about", label: "About Us" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/contact", label: "Contact Info" },
  { href: "/admin/social", label: "Social Links" },
  { href: "/admin/settings", label: "Website Settings" },
  { href: "/admin/media", label: "Media Library" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <aside className="w-64 bg-charcoal text-cream min-h-screen flex flex-col shrink-0">
      <div className="px-6 py-5 border-b border-cream/10">
        <span className="font-serif text-xl text-gold">4B Traders</span>
        <p className="text-xs text-cream/50">Admin Dashboard</p>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href}
            className={`block px-6 py-2.5 text-sm ${pathname === l.href ? "bg-gold/20 text-gold border-r-2 border-gold" : "text-cream/70 hover:bg-cream/5"}`}>
            {l.label}
          </Link>
        ))}
      </nav>
      <button onClick={logout} className="m-4 px-4 py-2 text-sm border border-cream/20 rounded hover:bg-cream/10">Logout</button>
    </aside>
  );
}

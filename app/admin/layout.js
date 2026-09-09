"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdminSession } from "../../lib/useAdmin";
import AdminSidebar from "../../components/AdminSidebar";

// Wraps every /admin/* page. Redirects non-admins to /admin/login.
// The login page itself renders without this guard/sidebar.
export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const { loading, isAdmin } = useAdminSession();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isLoginPage) return;
    if (!loading && !isAdmin) router.replace("/admin/login");
  }, [loading, isAdmin, isLoginPage, router]);

  if (isLoginPage) return children;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 text-sm">
        Checking admin session…
      </div>
    );
  }

  if (!isAdmin) {
    // Redirect is in flight — render nothing to avoid a flash of protected content.
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Mobile hamburger + slide-over sidebar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 bg-charcoal text-cream flex items-center justify-between px-4 py-3">
        <span className="font-serif text-lg text-gold">4B Traders Admin</span>
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="w-64" onClick={(e) => e.stopPropagation()}>
            <AdminSidebar />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <main className="flex-1 min-w-0 p-4 md:p-8 pt-20 md:pt-8">{children}</main>
    </div>
  );
}

export default function Footer({ settings }) {
  const s = settings || {};
  return (
    <footer className="bg-charcoal text-cream mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-serif text-xl text-gold mb-2">{s.business_name || "4B Traders"}</h3>
          <p className="text-sm text-cream/70">{s.address || "Address not set yet"}</p>
        </div>
        <div className="text-sm space-y-1 text-cream/80">
          {s.phone && <p>Phone: {s.phone}</p>}
          {s.whatsapp && <p>WhatsApp: {s.whatsapp}</p>}
          {s.email && <p>Email: {s.email}</p>}
          {s.business_hours && <p>Hours: {s.business_hours}</p>}
        </div>
        <div className="flex gap-4 text-sm">
          {s.instagram && <a href={s.instagram} target="_blank" rel="noreferrer">Instagram</a>}
          {s.facebook && <a href={s.facebook} target="_blank" rel="noreferrer">Facebook</a>}
          {s.tiktok && <a href={s.tiktok} target="_blank" rel="noreferrer">TikTok</a>}
          {s.youtube && <a href={s.youtube} target="_blank" rel="noreferrer">YouTube</a>}
        </div>
      </div>
      <p className="text-center text-xs text-cream/40 pb-6">© {new Date().getFullYear()} {s.business_name || "4B Traders"}. All rights reserved.</p>
    </footer>
  );
}

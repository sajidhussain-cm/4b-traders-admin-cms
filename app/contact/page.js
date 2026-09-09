import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getSettings } from "../../lib/publicData";

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="section-heading">Contact Us</h1>
        <div className="admin-card mt-6 space-y-2 text-charcoal/80">
          {settings.phone && <p>📞 {settings.phone}</p>}
          {settings.whatsapp && <p>💬 WhatsApp: {settings.whatsapp}</p>}
          {settings.email && <p>✉️ {settings.email}</p>}
          {settings.address && <p>📍 {settings.address}</p>}
          {settings.business_hours && <p>🕒 {settings.business_hours}</p>}
          {settings.google_maps_link && (
            <a href={settings.google_maps_link} target="_blank" rel="noreferrer" className="text-maroon underline block pt-2">
              View on Google Maps
            </a>
          )}
        </div>
      </div>
      <Footer settings={settings} />
    </>
  );
}

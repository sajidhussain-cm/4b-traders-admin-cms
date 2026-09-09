import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getGallery, getSettings } from "../../lib/publicData";

export default async function GalleryPage() {
  const [gallery, settings] = await Promise.all([getGallery(), getSettings()]);
  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="section-heading">Gallery</h1>
        {gallery.length === 0 ? (
          <p className="text-gray-500 mt-6">No gallery images yet — add some from the admin dashboard.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {gallery.map((g) => (
              <figure key={g.id} className="rounded-sm overflow-hidden bg-white border border-gold/20">
                <img src={g.image} alt={g.caption || ""} className="w-full aspect-square object-cover" />
                {g.caption && <figcaption className="p-2 text-sm text-center text-gray-600">{g.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}
      </div>
      <Footer settings={settings} />
    </>
  );
}

import HeroSlider from "../components/HeroSlider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { getSettings, getHomepage, getFeaturedProducts, getCategories, getTestimonials } from "../lib/publicData";

export default async function HomePage() {
  const [settings, homepage, featured, categories, testimonials] = await Promise.all([
    getSettings(), getHomepage(), getFeaturedProducts(), getCategories(), getTestimonials(),
  ]);

  return (
   <>
 <Navbar />

{/* HERO */}
<HeroSlider
  banners={[
    homepage.hero_banner_1,
    homepage.hero_banner_2,
    homepage.hero_banner_3,
    homepage.hero_banner_4,
    homepage.hero_banner_5,
  ]}
  title={homepage.hero_title || "STEP INTO ELEGANCE"}
  subtitle={
    homepage.hero_subtitle ||
    "Discover stylish khussa & jutti for women and kids."
  }
  buttonText={homepage.hero_button_text || "Shop Now"}
  buttonLink={homepage.hero_button_link || "/products"}
/>

{homepage.banner_text && (
  <div className="bg-maroon text-cream overflow-hidden py-2.5">
    <div className="whitespace-nowrap animate-marquee">
      <span className="mx-8 text-sm md:text-base tracking-wide">
        🔔 {homepage.banner_text}
      </span>
      <span className="mx-8 text-sm md:text-base tracking-wide">
        🔔 {homepage.banner_text}
      </span>
      <span className="mx-8 text-sm md:text-base tracking-wide">
        🔔 {homepage.banner_text}
      </span>
    </div>
  </div>
)}

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="section-heading">Shop by Category</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {categories.map((c) => (
              <a key={c.id} href={`/products?category=${c.id}`} className="group relative rounded-sm overflow-hidden aspect-[4/5] bg-gray-100">
                {c.image && <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                  <span className="text-cream font-serif text-lg">{c.name}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="section-heading">Featured Pieces</h2>
        {featured.length === 0 ? (
          <p className="text-gray-500 mt-4">No featured products yet — add some from the admin dashboard.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mt-8">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="section-heading">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {testimonials.map((t) => (
              <div key={t.id} className="admin-card">
                <p className="text-charcoal/80 italic">&ldquo;{t.review}&rdquo;</p>
                <p className="mt-3 font-medium text-maroon">{t.customer_name}</p>
                <p className="text-gold">{"★".repeat(t.rating)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer settings={settings} />
    </>
  );
}

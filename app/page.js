import HeroSlider from "../components/HeroSlider";
import FlashSaleCountdown from "../components/FlashSaleCountdown";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import {
  getSettings,
  getHomepage,
  getFeaturedProducts,
  getCategories,
  getTestimonials,
} from "../lib/publicData";

export default async function HomePage() {
  const [settings, homepage, featured, categories, testimonials] =
    await Promise.all([
      getSettings(),
      getHomepage(),
      getFeaturedProducts(),
      getCategories(),
      getTestimonials(),
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
        bannerLinks={[
          homepage.hero_banner_1_link,
          homepage.hero_banner_2_link,
          homepage.hero_banner_3_link,
          homepage.hero_banner_4_link,
          homepage.hero_banner_5_link,
        ]}
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

     {/* BULK & INDIVIDUAL SHOPPING */}
<section className="bg-[#f8f4ee] py-10 md:py-12">
  <div className="max-w-7xl mx-auto px-6">

    <div className="flex flex-col md:flex-row border border-[#b89b72]/30 bg-white overflow-hidden">

      {/* INDIVIDUAL */}
      <a
        href="/products"
        className="group relative flex-1 min-h-[170px] md:min-h-[190px] overflow-hidden"
      >
        {homepage.individual_section_image && (
          <img
            src={homepage.individual_section_image}
            alt="Shop Individually"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition" />

        <div className="relative z-10 h-full flex items-center p-6 md:p-8">
          <div>
            <p className="text-white/80 uppercase tracking-[0.22em] text-[10px] md:text-xs">
              For Everyday Shoppers
            </p>

            <h3 className="font-serif text-2xl md:text-3xl text-white mt-2">
              Shop Individually
            </h3>

            <span className="inline-flex items-center gap-2 mt-3 text-white text-[10px] uppercase tracking-[0.18em] border-b border-white/60 pb-1">
              Shop Now
              <span>→</span>
            </span>
          </div>
        </div>
      </a>

      {/* DIVIDER */}
      <div className="w-full h-px md:w-px md:h-auto bg-[#b89b72]/50 shrink-0" />

      {/* BULK / WHOLESALE */}
      <a
        href="/bulk"
        className="group relative flex-1 min-h-[170px] md:min-h-[190px] overflow-hidden"
      >
        {homepage.bulk_section_image && (
          <img
            src={homepage.bulk_section_image}
            alt="Bulk and Wholesale"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition" />

        <div className="relative z-10 h-full flex items-center p-6 md:p-8">
          <div>
            <p className="text-white/80 uppercase tracking-[0.22em] text-[10px] md:text-xs">
              For Retailers & Businesses
            </p>

            <h3 className="font-serif text-2xl md:text-3xl text-white mt-2">
              Bulk & Wholesale
            </h3>

            <span className="inline-flex items-center gap-2 mt-3 text-white text-[10px] uppercase tracking-[0.18em] border-b border-white/60 pb-1">
              Explore Wholesale
              <span>→</span>
            </span>
          </div>
        </div>
      </a>

    </div>
  </div>
</section>
      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="bg-[#f8f4ee] py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-[#8b6b45] uppercase tracking-[0.35em] text-xs font-medium">
                Explore Our Collection
              </p>

              <h2 className="font-serif text-4xl md:text-5xl text-[#4a1717] mt-3">
                Shop by Category
              </h2>

              <div className="w-16 h-px bg-[#b89b72] mx-auto mt-5" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-7">
              {categories.map((c) => (
                <a
                  key={c.id}
                  href={`/products?category=${c.id}`}
                  className="group relative overflow-hidden bg-white aspect-[4/5] shadow-sm"
                >
                  {c.image && (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <p className="text-white font-serif text-xl md:text-2xl">
                      {c.name}
                    </p>

                    <span className="inline-block text-white/80 text-xs uppercase tracking-[0.2em] mt-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      Shop Collection
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <section className="bg-white py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[#8b6b45] uppercase tracking-[0.35em] text-xs font-medium">
                  Curated For You
                </p>

                <h2 className="font-serif text-4xl md:text-5xl text-[#4a1717] mt-2">
                  Featured Pieces
                </h2>
              </div>

              <a
                href="/products"
                className="hidden md:inline-block text-xs uppercase tracking-[0.2em] text-[#4a1717] border-b border-[#4a1717]/40 pb-1 hover:border-[#4a1717] transition"
              >
                View All
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
              {featured.map((p) => (
                <div key={p.id} className="group">
                  <div className="overflow-hidden bg-[#f8f4ee]">
                    <ProductCard product={p} />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10 md:hidden">
              <a
                href="/products"
                className="inline-block text-xs uppercase tracking-[0.2em] text-[#4a1717] border-b border-[#4a1717]/40 pb-1"
              >
                View All Products
              </a>
            </div>
          </div>
        </section>
      )}

      {/* LADIES & KIDS COLLECTIONS */}
      <section className="bg-[#f8f4ee] py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[#8b6b45] uppercase tracking-[0.35em] text-xs font-medium">
              Made For Every Step
            </p>

            <h2 className="font-serif text-4xl md:text-5xl text-[#4a1717] mt-3">
              Explore Our Collections
            </h2>

            <div className="w-16 h-px bg-[#b89b72] mx-auto mt-5" />
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* LADIES */}
            {categories
              .filter((c) => c.name === "Ladies Khussa")
              .map((c) => (
                <a
                  key={c.id}
                  href={`/products?category=${c.id}`}
                  className="group relative overflow-hidden aspect-[16/10] bg-white"
                >
                  {c.image && (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9">
                    <p className="text-white/80 uppercase tracking-[0.25em] text-xs">
                      For Her
                    </p>

                    <h3 className="font-serif text-3xl md:text-4xl text-white mt-2">
                      Ladies Khussa
                    </h3>

                    <span className="inline-block mt-4 text-white text-xs uppercase tracking-[0.2em] border-b border-white/60 pb-1">
                      Shop Collection
                    </span>
                  </div>
                </a>
              ))}

            {/* KIDS */}
            {categories
              .filter((c) => c.name === "Kid's Khussa")
              .map((c) => (
                <a
                  key={c.id}
                  href={`/products?category=${c.id}`}
                  className="group relative overflow-hidden aspect-[16/10] bg-white"
                >
                  {c.image && (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9">
                    <p className="text-white/80 uppercase tracking-[0.25em] text-xs">
                      For Little Ones
                    </p>

                    <h3 className="font-serif text-3xl md:text-4xl text-white mt-2">
                      Kid's Khussa
                    </h3>

                    <span className="inline-block mt-4 text-white text-xs uppercase tracking-[0.2em] border-b border-white/60 pb-1">
                      Shop Collection
                    </span>
                  </div>
                </a>
              ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      {featured.length > 0 && (
        <section className="bg-white py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-[#8b6b45] uppercase tracking-[0.35em] text-xs font-medium">
                Loved By Our Customers
              </p>

              <h2 className="font-serif text-4xl md:text-5xl text-[#4a1717] mt-3">
                Best Sellers
              </h2>

              <div className="w-16 h-px bg-[#b89b72] mx-auto mt-5" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
              {featured.slice(0, 4).map((p) => (
                <div key={p.id} className="group">
                  <div className="overflow-hidden bg-[#f8f4ee]">
                    <ProductCard product={p} />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <a
                href="/products"
                className="inline-block text-xs uppercase tracking-[0.2em] text-[#4a1717] border-b border-[#4a1717]/40 pb-1 hover:border-[#4a1717] transition"
              >
                Shop All
              </a>
            </div>
          </div>
        </section>
      )}

      {/* FLASH SALE */}
      {homepage.flash_sale_enabled &&
        homepage.flash_sale_title &&
        homepage.flash_sale_end && (
          <section className="bg-[#8A7565] py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-6">
              <div className="border border-[#d8bd91]/50 px-6 py-10 md:px-12 md:py-14 text-center">
                <p className="text-[#ead5b5] uppercase tracking-[0.35em] text-xs md:text-sm font-medium">
                  Limited Time Offer
                </p>

                <h2 className="font-serif text-4xl md:text-6xl text-white mt-4">
                  {homepage.flash_sale_title}
                </h2>

                <div className="w-16 h-px bg-[#d8bd91] mx-auto mt-5" />

                {homepage.flash_sale_subtitle && (
                  <p className="text-white/85 mt-5 max-w-xl mx-auto text-sm md:text-base leading-7">
                    {homepage.flash_sale_subtitle}
                  </p>
                )}

                <div className="mt-8">
                  <FlashSaleCountdown endDate={homepage.flash_sale_end} />
                </div>

                <a
                  href="/products"
                  className="inline-block mt-8 bg-white text-[#4a3026] px-8 py-4 text-xs uppercase tracking-[0.2em] hover:bg-[#f8f4ee] transition shadow-sm"
                >
                  Shop Sale
                </a>
              </div>
            </div>
          </section>
        )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="bg-[#f8f4ee] py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-[#8b6b45] uppercase tracking-[0.35em] text-xs font-medium">
                Customer Love
              </p>

              <h2 className="font-serif text-4xl md:text-5xl text-[#4a1717] mt-3">
                What Our Customers Say
              </h2>

              <div className="w-16 h-px bg-[#b89b72] mx-auto mt-5" />
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-white border border-[#b89b72]/25 p-7 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="text-[#b89b72] text-2xl leading-none">
                    “
                  </div>

                  <p className="text-[#3b3530]/80 italic text-sm md:text-base leading-7 mt-4">
                    &ldquo;{t.review}&rdquo;
                  </p>

                  <div className="border-t border-[#b89b72]/20 mt-6 pt-5">
                    <p className="font-medium text-[#4a1717]">
                      {t.customer_name}
                    </p>

                    <p className="text-[#b89b72] text-sm mt-2">
                      {"★".repeat(t.rating)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
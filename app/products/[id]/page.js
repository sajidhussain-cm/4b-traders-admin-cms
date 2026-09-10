import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AddToCartForm from "../../../components/AddToCartForm";
import ProductGallery from "../../../components/ProductGallery";
import {
  getProduct,
  getSettings,
  getAllProducts,
} from "../../../lib/publicData";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }) {
  const [product, settings, allProducts] = await Promise.all([
    getProduct(params.id),
    getSettings(),
    getAllProducts(),
  ]);

  if (!product) notFound();

  const onSale =
    product.sale_price && product.sale_price < product.price;

  /*
    Related products:
    Pehle same category ke products,
    phir same style ke products.
    Current product ko list se remove kar diya gaya hai.
  */
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .sort((a, b) => {
      const aScore =
        (a.category_id === product.category_id ? 2 : 0) +
        (a.style && a.style === product.style ? 1 : 0);

      const bScore =
        (b.category_id === product.category_id ? 2 : 0) +
        (b.style && b.style === product.style ? 1 : 0);

      return bScore - aScore;
    })
    .slice(0, 4);

  return (
    <>
      <Navbar />

      <main className="bg-[#fcfaf7]">

        {/* PRODUCT MAIN AREA */}
        <section className="max-w-7xl mx-auto px-5 md:px-8 py-8 md:py-14">

          {/* BREADCRUMB */}
          <div className="mb-7 text-[10px] md:text-xs text-[#8b6b45] uppercase tracking-[0.2em]">
            Home / Collection / {product.name}
          </div>

          {/* IMAGE + DETAILS SIDE BY SIDE */}
         <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-16 items-stretch">

            {/* LEFT SIDE: PRODUCT IMAGE */}
            <div className="h-full">
  <div className="md:sticky md:top-24">
    <ProductGallery
      images={product.images}
      productName={product.name}
    />
  </div>
</div>

            {/* RIGHT SIDE: PRODUCT DETAILS */}
            <div className="md:pt-2 lg:pt-5">

              {/* BRAND */}
              <p className="text-[#8b6b45] uppercase tracking-[0.3em] text-xs font-medium mb-3">
                4B Traders
              </p>

              {/* PRODUCT NAME */}
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#4a1717] leading-tight">
                {product.name}
              </h1>

              {/* PRICE */}
              <div className="flex items-center gap-4 mt-5 pb-6 border-b border-[#4a1717]/10">

                {onSale ? (
                  <>
                    <span className="text-2xl md:text-3xl font-medium text-[#4a1717]">
                      Rs. {product.sale_price}
                    </span>

                    <span className="text-base text-gray-400 line-through">
                      Rs. {product.price}
                    </span>

                    <span className="text-[10px] uppercase tracking-[0.15em] bg-[#4a1717] text-white px-3 py-1.5">
                      Sale
                    </span>
                  </>
                ) : (
                  <span className="text-2xl md:text-3xl font-medium text-[#4a1717]">
                    Rs. {product.price}
                  </span>
                )}

              </div>
{/** STOCK STATUS */}
<div className="pt-4">
  {Number(product.stock) <= 0 ? (
    <span className="text-xs uppercase tracking-[0.2em] text-red-700">
      Out of Stock
    </span>
  ) : (
    <span className="text-xs uppercase tracking-[0.2em] text-green-700">
      In Stock: {product.stock} pairs available
    </span>
  )}
</div>
              {/* DESCRIPTION */}
              {product.description && (
                <div className="py-6 border-b border-[#4a1717]/10">
                  <p className="text-[#4a1717]/75 leading-7 text-sm md:text-base">
                    {product.description}
                  </p>
                </div>
              )}

              {/* CART / BUY SECTION */}
              <div className="py-7">
                <AddToCartForm
                  product={product}
                  whatsapp={settings.whatsapp}
                />
              </div>

              {/* BENEFITS */}
              <div className="border-t border-[#4a1717]/10 pt-6 space-y-5">

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#f8f4ee] flex items-center justify-center text-[#8b6b45]">
                    🚚
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#4a1717]">
                      Shipping Information
                    </p>

                    <p className="text-xs text-gray-500 mt-1 leading-5">
                      Shipping details will be shown during checkout.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#f8f4ee] flex items-center justify-center text-[#8b6b45]">
                    ✓
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#4a1717]">
                      Quality Checked
                    </p>

                    <p className="text-xs text-gray-500 mt-1 leading-5">
                      Your selected pair is carefully checked before dispatch.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* PRODUCT DETAILS */}
        <section className="bg-white border-t border-[#4a1717]/10">
          <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 md:py-20">

            <div className="grid md:grid-cols-2 gap-12 md:gap-20">

              {/* DESCRIPTION */}
              <div>
                <p className="text-[#8b6b45] uppercase tracking-[0.3em] text-xs font-medium">
                  Product Details
                </p>

                <h2 className="font-serif text-3xl md:text-4xl text-[#4a1717] mt-3">
                  Description
                </h2>

                <div className="w-12 h-px bg-[#b89b72] mt-5 mb-6" />

                <p className="text-[#4a1717]/70 leading-7 text-sm md:text-base">
                  {product.description ||
                    "Beautifully crafted footwear designed for timeless style and everyday elegance."}
                </p>
              </div>

              {/* KEY FEATURES */}
              <div>
                <p className="text-[#8b6b45] uppercase tracking-[0.3em] text-xs font-medium">
                  Product Information
                </p>

                <h2 className="font-serif text-3xl md:text-4xl text-[#4a1717] mt-3">
                  Key Features
                </h2>

                <div className="w-12 h-px bg-[#b89b72] mt-5 mb-6" />

                <div className="space-y-4">

                  {product.style && (
                    <div className="flex justify-between gap-5 border-b border-[#4a1717]/10 pb-3">
                      <span className="text-sm text-gray-500">
                        Style
                      </span>

                      <span className="text-sm text-[#4a1717] font-medium">
                        {product.style}
                      </span>
                    </div>
                  )}

                  {product.colors?.length > 0 && (
                    <div className="flex justify-between gap-5 border-b border-[#4a1717]/10 pb-3">
                      <span className="text-sm text-gray-500">
                        Available Colors
                      </span>

                      <span className="text-sm text-[#4a1717] font-medium text-right">
                        {product.colors.join(", ")}
                      </span>
                    </div>
                  )}

                  {product.sizes?.length > 0 && (
                    <div className="flex justify-between gap-5 border-b border-[#4a1717]/10 pb-3">
                      <span className="text-sm text-gray-500">
                        Available Sizes
                      </span>

                      <span className="text-sm text-[#4a1717] font-medium text-right">
                        {product.sizes.join(", ")}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between gap-5 border-b border-[#4a1717]/10 pb-3">
                    <span className="text-sm text-gray-500">
                      Product Type
                    </span>

                    <span className="text-sm text-[#4a1717] font-medium">
                      Traditional Footwear
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="bg-white border-t border-[#4a1717]/10">

            <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">

              <div className="text-center mb-12">

                <p className="text-[#8b6b45] uppercase tracking-[0.35em] text-xs font-medium">
                  You May Also Like
                </p>

                <h2 className="font-serif text-4xl md:text-5xl text-[#4a1717] mt-3">
                  Related Products
                </h2>

                <div className="w-16 h-px bg-[#b89b72] mx-auto mt-5" />

              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">

                {relatedProducts.map((p) => (
                  <a
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="group"
                  >

                    <div className="relative aspect-[4/5] overflow-hidden bg-[#f8f4ee]">
                      <img
                        src={p.images?.[0] || "/placeholder.jpg"}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
{p.sale_price && p.sale_price < p.price && (
  <span className="absolute top-3 left-3 bg-[#4a1717] text-white text-[9px] uppercase tracking-[0.15em] px-3 py-1.5">
    Sale
  </span>
)}
</div>
                   <div className="pt-4 px-1">

                      <h3 className="font-serif text-lg md:text-xl text-[#4a1717] group-hover:text-[#8b6b45] transition">
                        {p.name}
                      </h3>

                      <div className="flex items-center gap-2 mt-2"

                    >

                        {p.sale_price &&
                        p.sale_price < p.price ? (
                          <>
                            <span className="text-sm font-medium text-[#4a1717]">
                              Rs. {p.sale_price}
                            </span>

                            <span className="text-xs text-gray-400 line-through">
                              Rs. {p.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-medium text-[#4a1717]">
                            Rs. {p.price}
                          </span>
                        )}

                      </div>

                    </div>

                  </a>
                ))}

              </div>

            </div>

          </section>
        )}

      </main>

      <Footer settings={settings} />
    </>
  );
}
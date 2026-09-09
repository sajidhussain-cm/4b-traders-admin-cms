import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AddToCartForm from "../../../components/AddToCartForm";
import { getProduct, getSettings } from "../../../lib/publicData";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }) {
  const [product, settings] = await Promise.all([getProduct(params.id), getSettings()]);
  if (!product) notFound();

  const onSale = product.sale_price && product.sale_price < product.price;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
        <div className="space-y-3">
          <div className="aspect-square bg-white border border-gold/20 rounded-sm overflow-hidden">
            <img src={product.images?.[0] || "/placeholder.jpg"} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.slice(1).map((img, i) => (
                <img key={i} src={img} className="w-20 h-20 object-cover rounded-sm border border-gold/20" alt="" />
              ))}
            </div>
          )}
        </div>
        <div>
          <h1 className="font-serif text-3xl text-maroon mb-2">{product.name}</h1>
          <div className="flex gap-3 items-baseline mb-4">
            {onSale ? (
              <>
                <span className="text-2xl text-maroon font-medium">Rs. {product.sale_price}</span>
                <span className="text-gray-400 line-through">Rs. {product.price}</span>
              </>
            ) : (
              <span className="text-2xl text-maroon font-medium">Rs. {product.price}</span>
            )}
          </div>
          <p className="text-charcoal/80 mb-6">{product.description}</p>
          <AddToCartForm product={product} whatsapp={settings.whatsapp} />
        </div>
      </div>
      <Footer settings={settings} />
    </>
  );
}

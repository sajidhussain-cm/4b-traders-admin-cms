import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { getAllProducts, getCategories, getSettings } from "../../lib/publicData";

export default async function ProductsPage({ searchParams }) {
 const categoryParam = searchParams?.category;
const style = searchParams?.style;

const [categories, settings] = await Promise.all([
  getCategories(),
  getSettings(),
]);

const categoryId =
  categoryParam === "ladies"
    ? categories.find((c) => c.name === "Ladies Khussa")?.id
    : categoryParam === "kids"
    ? categories.find((c) => c.name === "Kid's Khussa")?.id
    : categoryParam;

const products = await getAllProducts({ categoryId, style });

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="section-heading">Shop the Collection</h1>
        <div className="flex gap-3 flex-wrap mt-4 mb-10 text-sm">
          <a href="/products" className={`px-4 py-1.5 rounded-full border ${!categoryId ? "bg-maroon text-cream border-maroon" : "border-gray-300"}`}>All</a>
          {categories.map((c) => (
            <a key={c.id} href={`/products?category=${c.id}`}
               className={`px-4 py-1.5 rounded-full border ${categoryId === c.id ? "bg-maroon text-cream border-maroon" : "border-gray-300"}`}>
              {c.name}
            </a>
          ))}
        </div>
        {products.length === 0 ? (
          <p className="text-gray-500">No products yet — add some from the admin dashboard at /admin.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
      <Footer settings={settings} />
    </>
  );
}

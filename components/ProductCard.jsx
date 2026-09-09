import Link from "next/link";

export default function ProductCard({ product }) {
  const img = product.images?.[0] || "/placeholder.jpg";
  const onSale = product.sale_price && product.sale_price < product.price;
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="aspect-square bg-white overflow-hidden rounded-sm border border-gold/20">
        <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="mt-3">
        <h3 className="font-serif text-lg text-charcoal">{product.name}</h3>
        <div className="flex gap-2 items-baseline">
          {onSale ? (
            <>
              <span className="text-maroon font-medium">Rs. {product.sale_price}</span>
              <span className="text-gray-400 line-through text-sm">Rs. {product.price}</span>
            </>
          ) : (
            <span className="text-maroon font-medium">Rs. {product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

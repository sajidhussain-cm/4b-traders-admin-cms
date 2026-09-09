import ProductForm from "../../../../components/ProductForm";

export default function EditProductPage({ params }) {
  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-6">Edit Product</h1>
      <ProductForm productId={params.id} />
    </div>
  );
}

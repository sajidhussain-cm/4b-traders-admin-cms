"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "./CartContext";

export default function AddToCartForm({ product, whatsapp }) {
  const [size, setSize] = useState(product.sizes?.[0] || "");
  const [color, setColor] = useState(product.colors?.[0] || "");
  const [qty, setQty] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const { addItem } = useCart();

  const price = product.sale_price || product.price;
  const outOfStock = Number(product.stock) <= 0;

  const isKidsProduct = product.sizes?.some(
    (s) => Number(s) >= 26 && Number(s) <= 32
  );

  const sizeOptions = isKidsProduct
    ? ["26", "27", "28", "29", "30", "31", "32"]
    : ["36", "37", "38", "39", "40", "41", "42"];

  function isSizeAvailable(s) {
    return product.sizes?.includes(s);
  }

  function decreaseQty() {
    setQty((q) => Math.max(1, q - 1));
  }

  function increaseQty() {
    setQty((q) => q + 1);
  }

  function handleAdd() {
    if (outOfStock) {
  toast.error("This product is currently out of stock");
  return;
}
    if (product.sizes?.length > 0 && !size) {
      toast.error("Please select a size");
      return;
    }

    addItem({
      product_id: product.id,
      name: product.name,
      size,
      color,
      qty,
      price,
    });

    toast.success("Added to cart");
  }

  function handleBuyNow() {
    if (outOfStock) {
  toast.error("This product is currently out of stock");
  return;
}
    if (product.sizes?.length > 0 && !size) {
      toast.error("Please select a size");
      return;
    }

    addItem({
      product_id: product.id,
      name: product.name,
      size,
      color,
      qty,
      price,
    });

    window.location.href = "/cart";
  }

  function handleWhatsAppOrder() {
    if (!whatsapp) return;

    const msg = `Hi! I'd like to order:
${product.name}
${size ? `Size: ${size}` : ""}
${color ? `Color: ${color}` : ""}
Quantity: ${qty}
Total: Rs. ${price * qty}`;

    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;

    window.open(url, "_blank");
  }

  return (
    <>
      <div className="space-y-7">

        {/* SIZE */}
        {product.sizes?.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-[#4a1717]">
                Select Size
              </label>

              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="text-xs text-[#8b6b45] border-b border-[#8b6b45]/40 hover:border-[#8b6b45] transition"
              >
                Size Guide
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((s) => {
                const available = isSizeAvailable(s);

                return (
                  <button
                    key={s}
                    type="button"
                    disabled={!available}
                    onClick={() => available && setSize(s)}
                    className={`relative min-w-[52px] px-4 py-2.5 border text-sm transition ${
                      !available
                        ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                        : size === s
                        ? "bg-[#4a1717] text-white border-[#4a1717]"
                        : "bg-white text-[#4a1717] border-[#4a1717]/20 hover:border-[#4a1717]"
                    }`}
                  >
                    {s}

                    {!available && (
                      <span className="absolute left-1/2 top-1/2 w-[120%] h-px bg-gray-400 -translate-x-1/2 -translate-y-1/2 rotate-[-12deg]" />
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-gray-400 mt-3">
              Crossed sizes are currently unavailable.
            </p>
          </div>
        )}

        {/* COLOR */}
        {product.colors?.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-[#4a1717] mb-3">
              Color
            </label>

            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`px-4 py-2.5 border text-sm transition ${
                    color === c
                      ? "bg-[#4a1717] text-white border-[#4a1717]"
                      : "bg-white text-[#4a1717] border-[#4a1717]/20 hover:border-[#4a1717]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QUANTITY */}
        <div>
          <label className="block text-sm font-medium text-[#4a1717] mb-3">
            Quantity
          </label>

          <div className="flex items-center w-fit border border-[#4a1717]/20">
            <button
              type="button"
              onClick={decreaseQty}
              className="w-11 h-11 text-lg text-[#4a1717] hover:bg-[#f8f4ee]"
            >
              −
            </button>

            <span className="w-12 text-center text-sm">
              {qty}
            </span>

            <button
              type="button"
              onClick={increaseQty}
              className="w-11 h-11 text-lg text-[#4a1717] hover:bg-[#f8f4ee]"
            >
              +
            </button>
          </div>
        </div>

       {/* ACTION BUTTONS */}
<div className="space-y-3">

  {outOfStock ? (
    <div className="w-full py-4 bg-gray-200 text-gray-500 text-center text-xs uppercase tracking-[0.2em] cursor-not-allowed">
      Out of Stock
    </div>
  ) : (
    <>
      <button
        type="button"
        onClick={handleBuyNow}
        className="w-full py-4 bg-[#4a1717] text-white text-xs uppercase tracking-[0.2em] hover:bg-[#351010] transition"
      >
        Buy It Now
      </button>

      <button
        type="button"
        onClick={handleAdd}
        className="w-full py-4 border border-[#4a1717] text-[#4a1717] text-xs uppercase tracking-[0.2em] hover:bg-[#4a1717] hover:text-white transition"
      >
        Add to Cart
      </button>

      {whatsapp && (
        <button
          type="button"
          onClick={handleWhatsAppOrder}
          className="w-full py-4 border border-[#b89b72] text-[#4a1717] text-xs uppercase tracking-[0.2em] hover:bg-[#f8f4ee] transition"
        >
          Order via WhatsApp
        </button>
      )}
    </>
  )}

</div>

        {/* PRODUCT BENEFITS */}
        <div className="border-t border-[#4a1717]/10 pt-6 space-y-4">

          <div className="flex gap-3">
            <span className="text-[#8b6b45]">✓</span>

            <div>
              <p className="text-sm font-medium text-[#4a1717]">
                Quality Checked
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Every pair is checked before dispatch.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="text-[#8b6b45]">✓</span>

            <div>
              <p className="text-sm font-medium text-[#4a1717]">
                Secure Ordering
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Easy ordering through our website.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* SIZE GUIDE MODAL */}
      {showSizeGuide && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-5"
          onClick={() => setShowSizeGuide(false)}
        >
          <div
            className="relative w-full max-w-md bg-[#fcfaf7] p-7 md:p-9 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              type="button"
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-5 text-2xl text-[#4a1717]"
            >
              ×
            </button>

            <p className="text-[#8b6b45] uppercase tracking-[0.3em] text-xs font-medium">
              4B Traders
            </p>

            <h2 className="font-serif text-3xl text-[#4a1717] mt-2">
              Size Guide
            </h2>

            <div className="w-12 h-px bg-[#b89b72] mt-4 mb-7" />

            <div className="space-y-6">

              {/* LADIES */}
              <div>
                <h3 className="text-sm font-medium text-[#4a1717] mb-3">
                  Ladies Khussa
                </h3>

                <div className="flex flex-wrap gap-2">
                  {["36", "37", "38", "39", "40", "41", "42"].map(
                    (s) => (
                      <span
                        key={s}
                        className="w-11 h-10 flex items-center justify-center border border-[#4a1717]/15 bg-white text-sm text-[#4a1717]"
                      >
                        {s}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* KIDS */}
              <div>
                <h3 className="text-sm font-medium text-[#4a1717] mb-3">
                  Kids Khussa
                </h3>

                <div className="flex flex-wrap gap-2">
                  {["26", "27", "28", "29", "30", "31", "32"].map(
                    (s) => (
                      <span
                        key={s}
                        className="w-11 h-10 flex items-center justify-center border border-[#4a1717]/15 bg-white text-sm text-[#4a1717]"
                      >
                        {s}
                      </span>
                    )
                  )}
                </div>
              </div>

            </div>

            <p className="text-xs text-gray-500 mt-7 leading-5">
              Please select from the available sizes shown on the product
              page. Sizes crossed out are currently unavailable.
            </p>

          </div>
        </div>
      )}
    </>
  );
}
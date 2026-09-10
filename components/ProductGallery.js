"use client";

import { useState } from "react";

export default function ProductGallery({ images, productName }) {
  const productImages = images?.length ? images : ["/placeholder.jpg"];
  const [activeImage, setActiveImage] = useState(productImages[0]);
  const [zoom, setZoom] = useState(false);

  return (
    <>
      <div className="space-y-4">
        {/* MAIN IMAGE */}
        <div
          className="relative aspect-square overflow-hidden bg-[#f8f4ee] cursor-zoom-in group"
          onClick={() => setZoom(true)}
        >
          <img
            src={activeImage}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

          <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[#4a1717]">
            Click to Zoom
          </div>
        </div>

        {/* THUMBNAILS */}
        {productImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {productImages.map((img, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`flex-shrink-0 w-20 h-20 overflow-hidden border transition ${
                  activeImage === img
                    ? "border-[#4a1717]"
                    : "border-[#4a1717]/15 hover:border-[#b89b72]"
                }`}
              >
                <img
                  src={img}
                  alt={`${productName} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ZOOM MODAL */}
      {zoom && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-5"
          onClick={() => setZoom(false)}
        >
          <button
            type="button"
            onClick={() => setZoom(false)}
            className="absolute top-5 right-5 w-10 h-10 bg-white text-[#4a1717] text-xl"
          >
            ×
          </button>

          <img
            src={activeImage}
            alt={productName}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
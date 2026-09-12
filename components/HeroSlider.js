"use client";

import { useEffect, useState } from "react";

export default function HeroSlider({
  banners = [],
  bannerLinks = [],
  buttonText,
  buttonLink,
}) {
  const validBanners = banners.filter(Boolean);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (validBanners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % validBanners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [validBanners.length]);

  if (validBanners.length === 0) {
    return (
      <section className="relative w-full aspect-[16/9] md:h-[680px] md:aspect-auto overflow-hidden bg-[#f8f4ee]">
        <div className="absolute inset-0 flex items-center justify-center">
          <a
            href={buttonLink || "/products"}
            className="inline-block bg-[#4a1717] text-white px-7 py-3 md:px-8 md:py-3.5 text-[11px] md:text-xs uppercase tracking-[0.18em] hover:bg-[#641f1f] transition shadow-sm"
          >
            {buttonText || "SHOP NOW"}
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full aspect-[16/9] md:h-[680px] md:aspect-auto overflow-hidden bg-[#f8f4ee]">
      {validBanners.map((image, index) => {
        const bannerLink =
          bannerLinks[index] || buttonLink || "/products";

        return (
          <a
            key={image + index}
            href={bannerLink}
            className={`absolute inset-0 block transition-transform duration-1000 ease-in-out ${
              index === current
                ? "translate-x-0"
                : index < current
                ? "-translate-x-full"
                : "translate-x-full"
            }`}
            aria-label={`Open campaign banner ${index + 1}`}
          >
            <img
              src={image}
              alt={`4B Traders campaign banner ${index + 1}`}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/5" />

            <div className="absolute left-5 md:left-12 bottom-5 md:bottom-20">
              <span className="inline-block bg-[#4a1717] text-white px-6 py-3 md:px-8 md:py-3.5 text-[10px] md:text-xs uppercase tracking-[0.18em] hover:bg-[#641f1f] transition shadow-sm">
                {buttonText || "SHOP NOW"}
              </span>
            </div>
          </a>
        );
      })}

      {validBanners.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              setCurrent(
                (current - 1 + validBanners.length) %
                  validBanners.length
              );
            }}
            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full border border-[#3f3530]/30 text-[#3f3530] bg-white/60 backdrop-blur-sm hover:bg-white transition"
            aria-label="Previous banner"
          >
            ←
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              setCurrent(
                (current + 1) % validBanners.length
              );
            }}
            className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full border border-[#3f3530]/30 text-[#3f3530] bg-white/60 backdrop-blur-sm hover:bg-white transition"
            aria-label="Next banner"
          >
            →
          </button>

          <div className="absolute bottom-3 md:bottom-7 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 md:gap-2">
            {validBanners.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrent(index);
                }}
                aria-label={`Go to banner ${index + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  index === current
                    ? "w-8 md:w-10 bg-[#b89b72]"
                    : "w-4 md:w-5 bg-[#3f3530]/30"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
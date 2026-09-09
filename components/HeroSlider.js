"use client";

import { useEffect, useState } from "react";

export default function HeroSlider({
  banners = [],
  title,
  subtitle,
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
      <section className="relative min-h-[620px] bg-maroon text-cream flex items-center">
        <div className="max-w-6xl mx-auto px-6 py-24 w-full">
          <h1 className="font-serif text-5xl md:text-7xl leading-tight max-w-2xl">
            {title || "STEP INTO ELEGANCE"}
          </h1>

          {subtitle && (
            <p className="mt-5 text-cream/80 text-lg max-w-xl">
              {subtitle}
            </p>
          )}

          {buttonText && (
            <a
              href={buttonLink || "/products"}
              className="btn-outline inline-block mt-8"
            >
              {buttonText}
            </a>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[560px] md:h-[680px] overflow-hidden bg-black">
      {validBanners.map((image, index) => (
        <div
          key={image + index}
          className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
            index === current
              ? "translate-x-0"
              : index < current
              ? "-translate-x-full"
              : "translate-x-full"
          }`}
        >
          <img
            src={image}
            alt={`4B Traders campaign banner ${index + 1}`}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex items-center">
        <div className="max-w-2xl text-white">
          <p className="uppercase tracking-[0.35em] text-sm md:text-base mb-4">
            4B Traders
          </p>

          <h1 className="font-serif text-5xl md:text-7xl leading-[0.95]">
            {title || "STEP INTO ELEGANCE"}
          </h1>

          {subtitle && (
            <p className="mt-6 text-white/85 text-base md:text-lg max-w-xl">
              {subtitle}
            </p>
          )}

          <a
            href={buttonLink || "/products"}
            className="inline-block mt-8 border border-white px-7 py-3 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition"
          >
            {buttonText || "Shop Now"}
          </a>
        </div>
      </div>

      {validBanners.length > 1 && (
        <>
          <button
            type="button"
            onClick={() =>
              setCurrent(
                (current - 1 + validBanners.length) %
                  validBanners.length
              )
            }
            className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/60 text-white hover:bg-white hover:text-black transition"
            aria-label="Previous banner"
          >
            ←
          </button>

          <button
            type="button"
            onClick={() =>
              setCurrent((current + 1) % validBanners.length)
            }
            className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/60 text-white hover:bg-white hover:text-black transition"
            aria-label="Next banner"
          >
            →
          </button>

          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {validBanners.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Go to banner ${index + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  index === current
                    ? "w-10 bg-white"
                    : "w-5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
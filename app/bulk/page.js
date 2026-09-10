"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function BulkPage() {
  function handleWholesaleInquiry(e) {
    e.preventDefault();

    const form = e.currentTarget;

    const name = form.name.value.trim();
    const business = form.business.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const products = form.products.value.trim();
    const quantity = form.quantity.value.trim();
    const message = form.message.value.trim();

    if (!name || !business || !phone || !products || !quantity) {
      alert("Please fill in all required fields.");
      return;
    }

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

    if (!whatsappNumber) {
      alert("WhatsApp number is not configured.");
      return;
    }

    const whatsappMessage = `Wholesale Inquiry

Name: ${name}
Business: ${business}
Email: ${email}
Phone / WhatsApp: ${phone}
Products / Styles: ${products}
Estimated Quantity: ${quantity}

Requirements:
${message || "No additional requirements provided."}`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(url, "_blank");
  }

  return (
    <>
      <Navbar />

      <main className="bg-[#f8f4ee] min-h-screen">
        {/* HERO */}
        <section className="bg-[#4a1717] text-white py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-[#d8c2a3] uppercase tracking-[0.35em] text-xs font-medium">
              For Retailers & Businesses
            </p>

            <h1 className="font-serif text-4xl md:text-6xl mt-4">
              Bulk & Wholesale
            </h1>

            <div className="w-16 h-px bg-[#b89b72] mx-auto mt-6" />

            <p className="text-white/75 max-w-2xl mx-auto mt-6 text-sm md:text-base leading-7">
              Bring the beauty of traditional khussas and juttis to your
              customers with our wholesale collection.
            </p>
          </div>
        </section>

        {/* WHOLESALE BENEFITS */}
        <section className="bg-white py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-[#8b6b45] uppercase tracking-[0.3em] text-xs font-medium">
                Wholesale Benefits
              </p>

              <h2 className="font-serif text-3xl md:text-5xl text-[#4a1717] mt-3">
                Built For Your Business
              </h2>

              <div className="w-16 h-px bg-[#b89b72] mx-auto mt-5" />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-[#b89b72]/30 p-8 text-center">
                <div className="text-[#8b6b45] text-2xl mb-4">01</div>

                <h3 className="font-serif text-2xl text-[#4a1717]">
                  Bulk Ordering
                </h3>

                <p className="text-gray-600 text-sm leading-6 mt-3">
                  Order multiple pairs for your retail store, boutique or
                  business.
                </p>
              </div>

              <div className="border border-[#b89b72]/30 p-8 text-center">
                <div className="text-[#8b6b45] text-2xl mb-4">02</div>

                <h3 className="font-serif text-2xl text-[#4a1717]">
                  Wholesale Pricing
                </h3>

                <p className="text-gray-600 text-sm leading-6 mt-3">
                  Special pricing can be arranged for qualifying wholesale
                  orders.
                </p>
              </div>

              <div className="border border-[#b89b72]/30 p-8 text-center">
                <div className="text-[#8b6b45] text-2xl mb-4">03</div>

                <h3 className="font-serif text-2xl text-[#4a1717]">
                  Business Support
                </h3>

                <p className="text-gray-600 text-sm leading-6 mt-3">
                  Tell us what you need and our team can help with your
                  wholesale inquiry.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHOLESALE ORDER TIERS */}
        <section className="bg-white py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-[#8b6b45] uppercase tracking-[0.3em] text-xs font-medium">
                Wholesale Orders
              </p>

              <h2 className="font-serif text-3xl md:text-5xl text-[#4a1717] mt-3">
                Wholesale Order Tiers
              </h2>

              <div className="w-16 h-px bg-[#b89b72] mx-auto mt-5" />

              <p className="text-gray-600 max-w-2xl mx-auto mt-5 text-sm md:text-base">
                Larger orders can qualify for special wholesale pricing.
                Contact us to discuss your required quantity and pricing.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-[#b89b72]/30 p-8 text-center">
                <p className="text-[#8b6b45] uppercase tracking-[0.2em] text-xs">
                  Tier 01
                </p>

                <h3 className="font-serif text-2xl text-[#4a1717] mt-3">
                  Small Wholesale
                </h3>

                <p className="text-gray-600 text-sm mt-4 leading-6">
                  Suitable for boutiques and small retail businesses.
                </p>

                <div className="border-t border-[#b89b72]/20 mt-6 pt-5">
                  <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                    Minimum Quantity
                  </p>

                  <p className="font-serif text-xl text-[#4a1717] mt-2">
                    Contact Us
                  </p>
                </div>
              </div>

              <div className="border border-[#b89b72]/30 p-8 text-center">
                <p className="text-[#8b6b45] uppercase tracking-[0.2em] text-xs">
                  Tier 02
                </p>

                <h3 className="font-serif text-2xl text-[#4a1717] mt-3">
                  Business Wholesale
                </h3>

                <p className="text-gray-600 text-sm mt-4 leading-6">
                  Designed for businesses placing larger recurring orders.
                </p>

                <div className="border-t border-[#b89b72]/20 mt-6 pt-5">
                  <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                    Minimum Quantity
                  </p>

                  <p className="font-serif text-xl text-[#4a1717] mt-2">
                    Contact Us
                  </p>
                </div>
              </div>

              <div className="border border-[#4a1717] p-8 text-center bg-[#f8f4ee]">
                <p className="text-[#8b6b45] uppercase tracking-[0.2em] text-xs">
                  Tier 03
                </p>

                <h3 className="font-serif text-2xl text-[#4a1717] mt-3">
                  Large Wholesale
                </h3>

                <p className="text-gray-600 text-sm mt-4 leading-6">
                  For retailers and businesses requiring high-volume orders.
                </p>

                <div className="border-t border-[#b89b72]/30 mt-6 pt-5">
                  <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
                    Minimum Quantity
                  </p>

                  <p className="font-serif text-xl text-[#4a1717] mt-2">
                    Contact Us
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-10">
              <a
                href="#wholesale-inquiry"
                className="inline-block bg-[#4a1717] text-white px-8 py-4 text-xs uppercase tracking-[0.2em] hover:bg-[#351010] transition"
              >
                Request Wholesale Pricing
              </a>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-[#f8f4ee] py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-[#8b6b45] uppercase tracking-[0.3em] text-xs font-medium">
                Simple Process
              </p>

              <h2 className="font-serif text-3xl md:text-5xl text-[#4a1717] mt-3">
                How Wholesale Works
              </h2>

              <div className="w-16 h-px bg-[#b89b72] mx-auto mt-5" />
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-12 h-12 rounded-full border border-[#b89b72] flex items-center justify-center mx-auto text-[#4a1717]">
                  1
                </div>

                <h3 className="font-serif text-xl text-[#4a1717] mt-5">
                  Send Your Inquiry
                </h3>

                <p className="text-gray-600 text-sm mt-2">
                  Tell us about the products and quantities you are interested
                  in.
                </p>
              </div>

              <div>
                <div className="w-12 h-12 rounded-full border border-[#b89b72] flex items-center justify-center mx-auto text-[#4a1717]">
                  2
                </div>

                <h3 className="font-serif text-xl text-[#4a1717] mt-5">
                  Discuss Your Order
                </h3>

                <p className="text-gray-600 text-sm mt-2">
                  We can discuss availability, quantities and wholesale
                  pricing.
                </p>
              </div>

              <div>
                <div className="w-12 h-12 rounded-full border border-[#b89b72] flex items-center justify-center mx-auto text-[#4a1717]">
                  3
                </div>

                <h3 className="font-serif text-xl text-[#4a1717] mt-5">
                  Place Your Order
                </h3>

                <p className="text-gray-600 text-sm mt-2">
                  Finalize your requirements and proceed with your wholesale
                  order.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHOLESALE INQUIRY */}
        <section
          id="wholesale-inquiry"
          className="bg-white py-16 md:py-24"
        >
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-10">
              <p className="text-[#8b6b45] uppercase tracking-[0.3em] text-xs font-medium">
                Wholesale Inquiry
              </p>

              <h2 className="font-serif text-3xl md:text-5xl text-[#4a1717] mt-3">
                Let&apos;s Talk Business
              </h2>

              <p className="text-gray-600 mt-4 text-sm md:text-base">
                Share your requirements and we&apos;ll get back to you.
              </p>
            </div>

            <form
              onSubmit={handleWholesaleInquiry}
              className="space-y-5"
            >
              <div className="grid md:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your Name"
                  className="w-full border border-gray-300 px-4 py-3.5 text-sm outline-none focus:border-[#4a1717]"
                />

                <input
                  type="text"
                  name="business"
                  required
                  placeholder="Business Name"
                  className="w-full border border-gray-300 px-4 py-3.5 text-sm outline-none focus:border-[#4a1717]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full border border-gray-300 px-4 py-3.5 text-sm outline-none focus:border-[#4a1717]"
                />

                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Phone / WhatsApp"
                  className="w-full border border-gray-300 px-4 py-3.5 text-sm outline-none focus:border-[#4a1717]"
                />
              </div>

              <input
                type="text"
                name="products"
                required
                placeholder="Products / Styles You Are Interested In"
                className="w-full border border-gray-300 px-4 py-3.5 text-sm outline-none focus:border-[#4a1717]"
              />

              <input
                type="number"
                name="quantity"
                min="1"
                required
                placeholder="Estimated Quantity"
                className="w-full border border-gray-300 px-4 py-3.5 text-sm outline-none focus:border-[#4a1717]"
              />

              <textarea
                name="message"
                rows="5"
                placeholder="Tell us about your requirements..."
                className="w-full border border-gray-300 px-4 py-3.5 text-sm outline-none focus:border-[#4a1717] resize-none"
              />

              <button
                type="submit"
                className="w-full bg-[#4a1717] text-white py-4 text-xs uppercase tracking-[0.2em] hover:bg-[#351010] transition"
              >
                Submit Wholesale Inquiry
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
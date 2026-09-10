"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "../../../lib/supabaseClient";
import ImageUpload from "../../../components/ImageUpload";

const empty = {
  hero_title: "",
  hero_subtitle: "",
  hero_image: "",
  hero_button_text: "",
  hero_button_link: "",

  hero_banner_1: "",
  hero_banner_2: "",
  hero_banner_3: "",
  hero_banner_4: "",
  hero_banner_5: "",

  banner_text: "",
  banner_image: "",
  banner_button_text: "",
  banner_button_link: "",

  flash_sale_enabled: false,
  flash_sale_title: "",
  flash_sale_subtitle: "",
  flash_sale_end: "",

  featured_product_ids: [],
};

export default function AdminHomepagePage() {
  const [form, setForm] = useState(empty);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const [{ data: homepage, error }, { data: prods }] =
        await Promise.all([
          supabase
            .from("homepage_content")
            .select("*")
            .eq("id", 1)
            .maybeSingle(),

          supabase
            .from("products")
            .select("id, name, price, images")
            .order("name"),
        ]);

      if (error) toast.error(error.message);

      if (homepage) {
        setForm({
          ...empty,
          ...homepage,
          featured_product_ids: homepage.featured_product_ids || [],
        });
      }

      setProducts(prods || []);
      setLoading(false);
    }

    load();
  }, []);

  function toggleFeatured(id) {
    setForm((f) => ({
      ...f,
      featured_product_ids: f.featured_product_ids.includes(id)
        ? f.featured_product_ids.filter((x) => x !== id)
        : [...f.featured_product_ids, id],
    }));
  }

  function updateField(field, value) {
    setForm((f) => ({
      ...f,
      [field]: value,
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();

    const { id, updated_at, ...payload } = form;

    const { error } = await supabase
      .from("homepage_content")
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Homepage updated");
  }

  if (loading) {
    return <p className="text-sm text-gray-400">Loading…</p>;
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-1">
        Homepage
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        Edit the hero section, promotional banner, and featured products shown on the live homepage.
      </p>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">

        {/* HERO CONTENT */}
        <div className="admin-card space-y-4">
          <h2 className="font-medium text-charcoal">
            Hero Section
          </h2>

          <div>
            <label className="admin-label">
              Hero Heading
            </label>

            <input
              className="admin-input"
              value={form.hero_title}
              onChange={(e) =>
                updateField("hero_title", e.target.value)
              }
            />
          </div>

          <div>
            <label className="admin-label">
              Hero Subheading
            </label>

            <textarea
              className="admin-input"
              rows={2}
              value={form.hero_subtitle}
              onChange={(e) =>
                updateField("hero_subtitle", e.target.value)
              }
            />
          </div>

          {/* 5 HERO BANNERS */}
          <div className="border-t border-gray-100 pt-5">
            <h3 className="font-medium text-charcoal mb-1">
              Hero Campaign Banners
            </h3>

            <p className="text-xs text-gray-400 mb-4">
              Upload up to 5 campaign banners. These will appear as a
              full-screen rotating hero slider on the homepage.
            </p>

            <div className="space-y-5">

              {[1, 2, 3, 4, 5].map((number) => {
                const field = `hero_banner_${number}`;

                return (
                  <div
                    key={field}
                    className="border border-gray-100 rounded-lg p-4"
                  >
                    <label className="admin-label">
                      Hero Banner {number}
                    </label>

                    <ImageUpload
                      onUploaded={(url) =>
                        updateField(field, url)
                      }
                    />

                    {form[field] && (
                      <div className="mt-3">
                        <img
                          src={form[field]}
                          alt={`Hero Banner ${number}`}
                          className="w-full aspect-video object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                );
              })}

            </div>
          </div>

          {/* OLD HERO IMAGE KEPT FOR SAFETY */}
          <div className="border-t border-gray-100 pt-5">
            <label className="admin-label">
              Previous Hero Image
            </label>

            <p className="text-xs text-gray-400 mb-2">
              Kept for compatibility with the existing homepage system.
              Do not remove it yet.
            </p>

            <ImageUpload
              onUploaded={(url) =>
                updateField("hero_image", url)
              }
            />

            {form.hero_image && (
              <img
                src={form.hero_image}
                className="w-full max-w-sm aspect-video object-cover rounded mt-2"
                alt="Previous Hero"
              />
            )}
          </div>

          {/* HERO BUTTON */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">
                Button Text
              </label>

              <input
                className="admin-input"
                value={form.hero_button_text}
                onChange={(e) =>
                  updateField(
                    "hero_button_text",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className="admin-label">
                Button Link
              </label>

              <input
                className="admin-input"
                value={form.hero_button_link}
                onChange={(e) =>
                  updateField(
                    "hero_button_link",
                    e.target.value
                  )
                }
                placeholder="/products"
              />
            </div>
          </div>
        </div>

        {/* PROMOTIONAL BANNER */}
        <div className="admin-card space-y-4">
          <h2 className="font-medium text-charcoal">
            Promotional Banner
          </h2>

          <div>
            <label className="admin-label">
              Banner Text
            </label>

            <input
              className="admin-input"
              value={form.banner_text || ""}
              onChange={(e) =>
                updateField("banner_text", e.target.value)
              }
            />
          </div>

          <div>
            <label className="admin-label">
              Banner Image
            </label>

            <ImageUpload
              onUploaded={(url) =>
                updateField("banner_image", url)
              }
            />

            {form.banner_image && (
              <img
                src={form.banner_image}
                className="w-full max-w-sm aspect-video object-cover rounded mt-2"
                alt="Promotional Banner"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">
                Button Text
              </label>

              <input
                className="admin-input"
                value={form.banner_button_text || ""}
                onChange={(e) =>
                  updateField(
                    "banner_button_text",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label className="admin-label">
                Button Link
              </label>

              <input
                className="admin-input"
                value={form.banner_button_link || ""}
                onChange={(e) =>
                  updateField(
                    "banner_button_link",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>
        {/* FLASH SALE */}
        <div className="admin-card space-y-4">
          <h2 className="font-medium text-charcoal">
            Flash Sale
          </h2>

          <p className="text-xs text-gray-400">
            Control the flash sale shown on the homepage. Keep it disabled
            until the offer is officially active.
          </p>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.flash_sale_enabled}
              onChange={(e) =>
                updateField("flash_sale_enabled", e.target.checked)
              }
            />
            <span className="text-sm text-charcoal">
              Enable Flash Sale
            </span>
          </label>

          <div>
            <label className="admin-label">
              Sale Title
            </label>

            <input
              className="admin-input"
              value={form.flash_sale_title || ""}
              onChange={(e) =>
                updateField("flash_sale_title", e.target.value)
              }
              placeholder="Weekend Clearance Sale"
            />
          </div>

          <div>
            <label className="admin-label">
              Sale Description
            </label>

            <textarea
              className="admin-input"
              rows={2}
              value={form.flash_sale_subtitle || ""}
              onChange={(e) =>
                updateField("flash_sale_subtitle", e.target.value)
              }
              placeholder="Limited time offer on selected styles."
            />
          </div>

          <div>
            <label className="admin-label">
              Sale End Date & Time
            </label>

            <input
              type="datetime-local"
              className="admin-input"
              value={form.flash_sale_end || ""}
              onChange={(e) =>
                updateField("flash_sale_end", e.target.value)
              }
            />

            <p className="text-xs text-gray-400 mt-1">
              Set the exact date and time when the sale should end.
            </p>
          </div>
        </div>
        {/* FEATURED PRODUCTS */}
        <div className="admin-card space-y-3">
          <h2 className="font-medium text-charcoal">
            Featured Products
          </h2>

          <p className="text-xs text-gray-400">
            Select which products appear in the homepage featured section.
          </p>

          {products.length === 0 ? (
            <p className="text-sm text-gray-400">
              No products yet — add some first.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto">
              {products.map((p) => (
                <label
                  key={p.id}
                  className="flex items-center gap-2 text-sm border border-gray-100 rounded p-2"
                >
                  <input
                    type="checkbox"
                    checked={form.featured_product_ids.includes(p.id)}
                    onChange={() => toggleFeatured(p.id)}
                  />

                  <span className="w-8 h-8 bg-gray-100 rounded overflow-hidden shrink-0">
                    {p.images?.[0] && (
                      <img
                        src={p.images[0]}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    )}
                  </span>

                  <span className="truncate">
                    {p.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div>
          <a
            href="/admin/categories"
            className="text-sm text-maroon underline"
          >
            Manage homepage categories →
          </a>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>

      </form>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "../../../lib/supabaseClient";
import ImageUpload from "../../../components/ImageUpload";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("website_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (error) toast.error(error.message);

      if (data) setForm(data);

      setLoading(false);
    }

    load();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();

    const payload = {
      business_name: form.business_name || "",
      logo: form.logo || "",
      favicon: form.favicon || "",
      site_title: form.site_title || "",
      meta_description: form.meta_description || "",
      currency: form.currency || "PKR",
      whatsapp_number: form.whatsapp_number || "",
    };

    const { error } = await supabase
      .from("website_settings")
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

    toast.success("Website settings updated");
  }

  if (loading) {
    return <p className="text-sm text-gray-400">Loading...</p>;
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-1">
        Website Settings
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        Site-wide identity and metadata.
      </p>

      <form onSubmit={handleSave} className="admin-card max-w-xl space-y-4">

        <div>
          <label className="admin-label">
            Website Name
          </label>

          <input
            className="admin-input"
            value={form.business_name || ""}
            onChange={(e) =>
              setForm({
                ...form,
                business_name: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="admin-label">
            Logo
          </label>

          <ImageUpload
            onUploaded={(url) =>
              setForm({
                ...form,
                logo: url,
              })
            }
          />

          {form.logo && (
            <img
              src={form.logo}
              className="h-12 mt-2"
              alt="Website logo"
            />
          )}
        </div>

        <div>
          <label className="admin-label">
            Favicon
          </label>

          <ImageUpload
            onUploaded={(url) =>
              setForm({
                ...form,
                favicon: url,
              })
            }
          />

          {form.favicon && (
            <img
              src={form.favicon}
              className="w-8 h-8 mt-2"
              alt="Website favicon"
            />
          )}
        </div>

        <div>
          <label className="admin-label">
            Website Title (browser tab)
          </label>

          <input
            className="admin-input"
            value={form.site_title || ""}
            onChange={(e) =>
              setForm({
                ...form,
                site_title: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="admin-label">
            Meta Description
          </label>

          <textarea
            className="admin-input"
            rows={2}
            value={form.meta_description || ""}
            onChange={(e) =>
              setForm({
                ...form,
                meta_description: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="admin-label">
            Currency
          </label>

          <select
            className="admin-input"
            value={form.currency || "PKR"}
            onChange={(e) =>
              setForm({
                ...form,
                currency: e.target.value,
              })
            }
          >
            <option value="PKR">PKR - Pakistani Rupee</option>
            <option value="USD">USD - US Dollar</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="AED">AED - UAE Dirham</option>
          </select>
        </div>

        {/* WHATSAPP NUMBER */}
        <div>
          <label className="admin-label">
            WhatsApp Number
          </label>

          <input
            type="text"
            className="admin-input"
            value={form.whatsapp_number || ""}
            onChange={(e) =>
              setForm({
                ...form,
                whatsapp_number: e.target.value,
              })
            }
            placeholder="923001234567"
          />

          <p className="text-xs text-gray-400 mt-1">
            Enter country code with number, without + or spaces.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </form>
    </div>
  );
}
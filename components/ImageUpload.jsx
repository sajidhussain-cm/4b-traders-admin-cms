"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "../lib/supabaseClient";

// Uploads directly to the Supabase Storage "media" bucket (see
// supabase/storage_setup.sql — only logged-in admins can write to it,
// anyone can read/view). Returns the public URL via onUploaded().
export default function ImageUpload({ onUploaded, multiple = false }) {
  const [uploading, setUploading] = useState(false);

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    setUploading(true);
    const supabase = createClient();
    const urls = [];

    for (const file of files) {
      if (!ALLOWED.includes(file.type)) { toast.error(`${file.name}: unsupported file type`); continue; }
      if (file.size > MAX_SIZE) { toast.error(`${file.name}: file too large (max 5MB)`); continue; }

      const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error } = await supabase.storage.from("media").upload(path, file);
      if (error) { toast.error(`Upload failed: ${error.message}`); continue; }

      const { data } = supabase.storage.from("media").getPublicUrl(path);
      urls.push(data.publicUrl);
    }

    setUploading(false);
    if (urls.length > 0) onUploaded(multiple ? urls : urls[0]);
  }

  return (
    <div>
      <input type="file" accept="image/*" multiple={multiple} onChange={handleFiles} disabled={uploading} className="text-sm" />
      {uploading && <p className="text-xs text-gray-500 mt-1">Uploading…</p>}
    </div>
  );
}

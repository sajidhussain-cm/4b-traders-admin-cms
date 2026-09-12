"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabaseClient";

export default function WhatsAppFloat() {
  const [number, setNumber] = useState("");

  useEffect(() => {
    async function loadNumber() {
      const supabase = createClient();

      const { data } = await supabase
        .from("website_settings")
        .select("whatsapp_number")
        .eq("id", 1)
        .maybeSingle();

      if (data?.whatsapp_number) {
        setNumber(data.whatsapp_number.replace(/\D/g, ""));
      }
    }

    loadNumber();
  }, []);

  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
    >
      <svg
        viewBox="0 0 32 32"
        className="w-7 h-7 fill-current"
        aria-hidden="true"
      >
        <path d="M19.11 17.19c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.15-1.34-.79-.7-1.33-1.57-1.49-1.84-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01s-.48.07-.73.34c-.25.27-.95.93-.95 2.27 0 1.34.98 2.63 1.11 2.81.14.18 1.92 2.94 4.65 4.12.65.28 1.16.45 1.56.57.66.21 1.26.18 1.73.11.53-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z" />
        <path d="M16 3C8.83 3 3 8.83 3 16c0 2.3.6 4.54 1.74 6.51L3 29l6.67-1.69A12.95 12.95 0 0 0 16 29c7.17 0 13-5.83 13-13S23.17 3 16 3zm0 23.6c-2.08 0-4.12-.56-5.9-1.62l-.42-.25-3.96 1 1.06-3.86-.27-.43A10.6 10.6 0 1 1 16 26.6z" />
      </svg>
    </a>
  );
}
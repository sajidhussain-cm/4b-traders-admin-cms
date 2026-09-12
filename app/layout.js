import "./globals.css";

import { Toaster } from "react-hot-toast";

import { CartProvider } from "../components/CartContext";
import WhatsAppFloat from "../components/WhatsAppFloat";

export const metadata = {
  title: "4B Traders | Ladies & Kids Khussa",

  description:
    "Shop stylish and comfortable khussas for women and kids at 4B Traders.",

  icons: {
    icon:
      "https://ongsdcjbupiqwlgtnvdm.supabase.co/storage/v1/object/public/media/1788892183287-Logo-of-4B.jpeg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" />

        <CartProvider>
          {children}
        </CartProvider>

        <WhatsAppFloat />
      </body>
    </html>
  );
}
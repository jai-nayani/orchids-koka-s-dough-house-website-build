import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

export const metadata: Metadata = {
  title: "Koka's Dough House — Delicious Crinkle Cookies in Miami",
  description: "Order freshly baked crinkle cookies from Koka's Dough House in Miami, FL. Classic Chocolate, Red Velvet, and Lemon Zest flavors. $20/dozen. Pickup, delivery, or shipping available.",
  openGraph: {
    title: "Koka's Dough House — Delicious Crinkle Cookies in Miami",
    description: "Order freshly baked crinkle cookies from Koka's Dough House in Miami, FL. Classic Chocolate, Red Velvet, and Lemon Zest flavors. $20/dozen.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

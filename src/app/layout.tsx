import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
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
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="d1fb2f24-972c-472d-9b5f-b3e59063c441"
        />
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}

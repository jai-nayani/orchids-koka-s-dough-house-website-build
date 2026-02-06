import Link from "next/link";
import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1A1614] text-[#F5F0E8]">
      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <h3 className="font-serif text-2xl font-semibold text-[#C8A96E] mb-4">
                Koka&apos;s Dough House
              </h3>
              <p className="text-[#A09890] text-sm leading-relaxed">
                Exquisite crinkle cookies baked to perfection with love by the Koka brothers in Miami, FL.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-[#F5F0E8] mb-4">Quick Links</h4>
              <nav className="flex flex-col gap-2">
                <Link href="/" className="text-[#A09890] hover:text-[#C8A96E] transition-colors text-sm">
                  Home
                </Link>
                <Link href="/about" className="text-[#A09890] hover:text-[#C8A96E] transition-colors text-sm">
                  About
                </Link>
                <Link href="/products" className="text-[#A09890] hover:text-[#C8A96E] transition-colors text-sm">
                  Products
                </Link>
                <Link href="/order" className="text-[#A09890] hover:text-[#C8A96E] transition-colors text-sm">
                  Order
                </Link>
              </nav>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-[#F5F0E8] mb-4">Contact Us</h4>
              <div className="space-y-2 text-sm">
                <p className="text-[#A09890]">
                  Text us: <span className="text-[#F5F0E8]">305-458-2119</span>
                </p>
                <p className="text-[#A09890]">
                  Email: <a href="mailto:nelupha@gmail.com" className="text-[#F5F0E8] hover:text-[#C8A96E] transition-colors">nelupha@gmail.com</a>
                </p>
                <p className="text-[#A09890]">
                  Location: <span className="text-[#F5F0E8]">Miami, FL</span>
                </p>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h4 className="font-semibold text-[#F5F0E8] mb-4">Payment Options</h4>
              <div className="space-y-2 text-sm text-[#A09890]">
                <p>Venmo: <span className="text-[#F5F0E8]">@kokasdoughhouse</span></p>
                <p>Zelle: <span className="text-[#F5F0E8]">(305) 458-2119</span></p>
                <p className="text-[#C8A96E]">Credit/Debit via Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Bar */}
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#8B7E74]">
            &copy; {new Date().getFullYear()} Koka&apos;s Dough House. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/kokasdoughhouse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A09890] hover:text-[#C8A96E] transition-colors"
              aria-label="Follow us on Instagram"
            >
              <Instagram size={20} />
            </a>
            <span className="text-xs text-[#8B7E74]">
              Made with love by the Koka Family
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

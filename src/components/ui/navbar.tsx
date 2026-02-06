"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const pathname = usePathname();

  // Ensure component has mounted before applying client-only styles
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Check initial scroll position after mount
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Use hasMounted to ensure scroll-based styling only applies after hydration
  const showScrolledStyle = hasMounted && isScrolled;

  return (
    <>
      <header
        suppressHydrationWarning
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          showScrolledStyle
            ? "bg-[#FAF7F2]/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex h-20 items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <span className="font-serif text-2xl font-semibold text-[#C8A96E] tracking-tight">
                  Koka&apos;s Dough House
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium text-[#C8A96E] transition-[text-shadow] duration-300 ease-in-out",
                      pathname === link.href
                        ? "[text-shadow:0_0_8px_rgba(200,169,110,0.4),0_0_16px_rgba(200,169,110,0.2)]"
                        : "hover:[text-shadow:0_0_8px_rgba(200,169,110,0.6),0_0_20px_rgba(200,169,110,0.3)]"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <Button
                asChild
                className="bg-[#C8A96E] text-[#1A1614] hover:bg-[#B8995E] rounded-full px-6 font-medium"
              >
                <Link href="/order">Order Now</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#2C1810] hover:text-[#C8A96E] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-[#1A1614]/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-3/4 max-w-sm bg-[#FAF7F2] shadow-xl"
            >
              <div className="flex flex-col h-full pt-24 px-6">
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={link.href}
                          className={cn(
                            "block py-3 text-lg font-medium border-b border-[#E8E2D9] text-[#C8A96E] transition-[text-shadow] duration-300 ease-in-out",
                            pathname === link.href
                              ? "[text-shadow:0_0_8px_rgba(200,169,110,0.4),0_0_16px_rgba(200,169,110,0.2)]"
                              : "hover:[text-shadow:0_0_8px_rgba(200,169,110,0.6),0_0_20px_rgba(200,169,110,0.3)]"
                          )}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8"
                >
                  <Button
                    asChild
                    className="w-full bg-[#C8A96E] text-[#1A1614] hover:bg-[#B8995E] rounded-full py-6 font-medium text-lg"
                  >
                    <Link href="/order">Order Now</Link>
                  </Button>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-auto pb-8"
                >
                  <p className="text-sm text-[#8B7E74]">Get in touch</p>
                  <p className="text-[#2C1810] font-medium mt-1">305-458-2119</p>
                  <p className="text-sm text-[#8B7E74] mt-2">Miami, FL</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Order Now Floating Button */}
      <div className="fixed bottom-6 right-6 z-30 md:hidden">
        <Button
          asChild
          className="bg-[#C8A96E] text-[#1A1614] hover:bg-[#B8995E] rounded-full px-6 py-6 font-medium shadow-lg"
        >
          <Link href="/order">Order Now</Link>
        </Button>
      </div>
    </>
  );
}

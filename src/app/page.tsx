"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Cookie, Users, Truck, Instagram, ChevronDown } from "lucide-react";

const products = [
  {
    id: "classic-chocolate",
    name: "Classic Chocolate Crinkle Cookies",
    price: 20,
    description: "Rich, fudgy, and dusted with powdered sugar — our signature crinkle cookie that started it all.",
    image: "/images/classic-chocolate-crinkle.jpg",
  },
  {
    id: "red-velvet",
    name: "Red Velvet Crinkle Cookies",
    price: 20,
    description: "Velvety smooth with a hint of cocoa and a gorgeous crimson crackle — a showstopper at any gathering.",
    image: "/images/red-velvet-crinkle.jpg",
  },
  {
    id: "lemon-zest",
    name: "Lemon Zest Crinkle Cookies",
    price: 20,
    description: "Bright, tangy, and perfectly sweet — a refreshing twist on the classic crinkle with real lemon zest.",
    image: "/images/lemon-zest-crinkle.jpg",
  },
];

const valueProps = [
  {
    icon: Cookie,
    title: "Baked Fresh to Order",
    description: "Every batch made from scratch with premium ingredients",
  },
  {
    icon: Users,
    title: "A True Family Effort",
    description: "Made with love by the Koka family in Miami",
  },
  {
    icon: Truck,
    title: "Pickup, Delivery & Shipping",
    description: "Local Miami delivery or shipped anywhere",
  },
];

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1920&h=1080&fit=crop&q=80"
            alt="Delicious crinkle cookies"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614] via-[#1A1614]/60 to-[#1A1614]/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold text-[#F5F0E8] mb-6 tracking-tight"
          >
            Koka&apos;s Dough House
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-[#E8E2D9] mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Exquisite crinkle cookies baked to perfection with love by the Koka brothers
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-[#C8A96E] text-[#1A1614] hover:bg-[#B8995E] rounded-full px-8 py-6 text-lg font-medium"
            >
              <Link href="/products">View Our Cookies</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-[#C8A96E] text-[#C8A96E] hover:bg-[#C8A96E] hover:text-[#1A1614] rounded-full px-8 py-6 text-lg font-medium bg-transparent"
            >
              <Link href="/order">Order Now</Link>
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-[#C8A96E]" />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#2C1810] mb-4">
              Dusty, Chewy, Fudgy, Heavenly Crinkle Cookies
            </h2>
            <p className="text-[#8B7E74] text-lg">
              Freshly baked for every celebration!
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <AnimatedSection key={product.id}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#C8A96E]"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-semibold text-[#2C1810] mb-2">
                      {product.name}
                    </h3>
                    <p className="text-[#C8A96E] font-semibold text-lg mb-3">
                      ${product.price} / dozen
                    </p>
                    <p className="text-[#8B7E74] text-sm mb-4 leading-relaxed">
                      {product.description}
                    </p>
                    <Button
                      asChild
                      className="w-full bg-[#C8A96E] text-[#1A1614] hover:bg-[#B8995E] rounded-full"
                    >
                      <Link href="/order">Order Now</Link>
                    </Button>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Koka's Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1A1614] bg-noise relative">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#F5F0E8] mb-4">
              Why Koka&apos;s?
            </h2>
            <p className="text-[#A09890] text-lg">
              What makes our cookies special
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueProps.map((prop, index) => (
              <AnimatedSection key={prop.title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="text-center p-8 rounded-2xl bg-[#2C1810]/50 border border-white/5"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#C8A96E]/10 flex items-center justify-center">
                    <prop.icon className="w-8 h-8 text-[#C8A96E]" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#F5F0E8] mb-3">
                    {prop.title}
                  </h3>
                  <p className="text-[#A09890] text-sm leading-relaxed">
                    {prop.description}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram / Social CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="mx-auto max-w-3xl text-center">
          <AnimatedSection>
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#2C1810] mb-4">
              Sweet Social Cravings
            </h2>
            <p className="text-[#8B7E74] text-lg mb-8">
              Delight in our crinkle cookies and follow us!
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#C8A96E] text-[#1A1614] hover:bg-[#B8995E] rounded-full px-8 py-6 text-lg font-medium"
            >
              <a
                href="https://instagram.com/kokasdoughhouse"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3"
              >
                <Instagram className="w-6 h-6" />
                Follow Us on Instagram
              </a>
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#2C1810] bg-noise">
        <div className="mx-auto max-w-3xl text-center">
          <AnimatedSection>
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#F5F0E8] mb-4">
              Ready to Order?
            </h2>
            <p className="text-[#A09890] text-lg mb-8">
              Fresh, delicious cookies are just a click away
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#C8A96E] text-[#1A1614] hover:bg-[#B8995E] rounded-full px-10 py-6 text-lg font-medium"
            >
              <Link href="/order">Order Your Cookies Now</Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

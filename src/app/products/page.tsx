"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: "classic-chocolate",
    name: "Classic Chocolate Crinkle Cookies",
    price: 20,
    description: "Rich, fudgy, and dusted with powdered sugar — our signature crinkle cookie that started it all.",
    longDescription: "Our Classic Chocolate Crinkle Cookies are the heart and soul of Koka's Dough House. Each cookie is baked to perfection with a deep, fudgy center and that signature crackled powdered sugar top. Made with premium cocoa and real butter, these cookies deliver an indulgent chocolate experience that will have you reaching for more.",
    image: "/images/classic-chocolate-crinkle.jpg",
  },
  {
    id: "red-velvet",
    name: "Red Velvet Crinkle Cookies",
    price: 20,
    description: "Velvety smooth with a hint of cocoa and a gorgeous crimson crackle — a showstopper at any gathering.",
    longDescription: "A stunning twist on the classic crinkle, our Red Velvet cookies combine the subtle cocoa flavor of red velvet with the soft, chewy texture of a perfectly baked crinkle cookie. The beautiful red color peeking through the powdered sugar cracks makes these cookies as gorgeous as they are delicious.",
    image: "/images/red-velvet-crinkle.jpg",
  },
  {
    id: "lemon-zest",
    name: "Lemon Zest Crinkle Cookies",
    price: 20,
    description: "Bright, tangy, and perfectly sweet — a refreshing twist on the classic crinkle with real lemon zest.",
    longDescription: "For those who love a bright, citrusy treat, our Lemon Zest Crinkle Cookies are pure sunshine in cookie form. Made with fresh lemon zest and a touch of lemon juice, these cookies offer a perfect balance of tart and sweet, with the same soft, chewy texture our crinkle cookies are known for.",
    image: "/images/lemon-zest-crinkle.jpg",
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

export default function ProductsPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-[#1A1614] bg-noise">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold text-[#F5F0E8] mb-6 tracking-tight"
          >
            Our Cookies
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-[#A09890]"
          >
            Each flavor crafted to perfection — $20 per dozen
          </motion.p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-24">
            {products.map((product, index) => (
              <AnimatedSection key={product.id}>
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`relative aspect-square rounded-3xl overflow-hidden shadow-xl ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2C1810] mb-4">
                      {product.name}
                    </h2>
                    <p className="text-[#C8A96E] font-semibold text-2xl mb-6">
                      ${product.price} / dozen
                    </p>
                    <p className="text-[#8B7E74] text-lg leading-relaxed mb-8">
                      {product.longDescription}
                    </p>
                    <Button
                      asChild
                      size="lg"
                      className="bg-[#C8A96E] text-[#1A1614] hover:bg-[#B8995E] rounded-full px-8 py-6 text-lg font-medium"
                    >
                      <Link href="/order">Order This Flavor</Link>
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Mix & Match Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="mx-auto max-w-3xl text-center">
          <AnimatedSection>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2C1810] mb-4">
              Mix and Match!
            </h2>
            <p className="text-[#8B7E74] text-lg mb-8">
              All cookies are sold by the dozen. Can&apos;t decide? Mix and match flavors in your order to try them all!
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#C8A96E] text-[#1A1614] hover:bg-[#B8995E] rounded-full px-10 py-6 text-lg font-medium"
            >
              <Link href="/order">Order Now</Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

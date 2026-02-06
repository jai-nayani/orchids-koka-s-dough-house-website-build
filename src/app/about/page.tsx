"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";

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

export default function AboutPage() {
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
            Baking with Love
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-[#A09890]"
          >
            Delicious crinkle cookies await
          </motion.p>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
        <div className="mx-auto max-w-4xl">
          <AnimatedSection>
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#2C1810] mb-8 text-center">
              Welcome to Koka&apos;s Dough House!
            </h2>
          </AnimatedSection>

          <AnimatedSection className="prose prose-lg mx-auto">
            <div className="space-y-6 text-[#2C1810] leading-relaxed">
              <p>
                We&apos;re <strong>Nikhil and Nithin Koka</strong>, two brothers (14 and 11 years old) with big dreams, endless energy, and a love for baking that comes straight from our family kitchen. What started as a holiday project has grown into our sweet little business, where we whip up crinkle cookies and create smiles one batch at a time.
              </p>
              <p>
                Our story is one of family. With Dad from India and Mom from Sri Lanka, we&apos;ve grown up surrounded by amazing flavors, a love for cooking and baking together. Our family spends a lot of time in the kitchen, sharing recipes, stories, and laughs. It&apos;s here that the idea for Koka&apos;s Dough House was born — and it&apos;s where we still come together to make it happen.
              </p>
              <p>
                We couldn&apos;t do this without our parents. They&apos;re not just our biggest cheerleaders — they&apos;re also our partners in this adventure. From teaching us how to bake to helping us with deliveries and cheering us on at every step, this is a true family effort.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Meet the Brothers Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F5F0E8]">
        <div className="mx-auto max-w-6xl">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#2C1810] mb-4">
              Meet the Brothers
            </h2>
            <p className="text-[#8B7E74] text-lg">
              The team behind every delicious cookie
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <AnimatedSection>
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-[#C8A96E]/10 flex items-center justify-center">
                  <span className="font-serif text-4xl text-[#C8A96E]">N</span>
                </div>
                <h3 className="font-serif text-2xl font-semibold text-[#2C1810] text-center mb-4">
                  Nikhil
                </h3>
                <p className="text-[#8B7E74] text-center leading-relaxed">
                  The high school freshman and creative chef who&apos;s always dreaming up new recipes and perfecting every detail to make our cookies unforgettable.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-[#C8A96E]/10 flex items-center justify-center">
                  <span className="font-serif text-4xl text-[#C8A96E]">N</span>
                </div>
                <h3 className="font-serif text-2xl font-semibold text-[#2C1810] text-center mb-4">
                  Nithin
                </h3>
                <p className="text-[#8B7E74] text-center leading-relaxed">
                  The 6th grade math wizard and business manager, who loves crunching numbers and making sure our cookie operation runs smoothly.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Our Promise Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1A1614] bg-noise">
        <div className="mx-auto max-w-4xl">
          <AnimatedSection>
            <div className="text-center space-y-6">
              <p className="text-[#F5F0E8] text-lg leading-relaxed">
                At Koka&apos;s Dough House, we pour our family&apos;s passion and teamwork into every cookie we bake. From our signature chocolate crinkle cookies to exciting new creations, we hope to share a little piece of our story — and a lot of sweetness — with you.
              </p>
              <p className="text-[#A09890] text-lg leading-relaxed">
                When you support our bakery, you&apos;re not just getting cookies — you&apos;re becoming part of our family&apos;s journey. Thank you for being here and helping us turn our dreams into reality.
              </p>
              <div className="pt-8 border-t border-white/10">
                <p className="font-serif text-2xl text-[#C8A96E] italic">
                  Let&apos;s bake.
                </p>
                <p className="text-[#F5F0E8] mt-4">
                  Warmly,<br />
                  <span className="font-semibold">Nikhil & Nithin</span><br />
                  <span className="text-[#C8A96E]">Koka&apos;s Dough House</span>
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2]">
        <div className="mx-auto max-w-3xl text-center">
          <AnimatedSection>
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#2C1810] mb-4">
              Ready to Taste the Difference?
            </h2>
            <p className="text-[#8B7E74] text-lg mb-8">
              Order your batch of homemade crinkle cookies today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-[#C8A96E] text-[#1A1614] hover:bg-[#B8995E] rounded-full px-8 py-6 text-lg font-medium"
              >
                <Link href="/order">Order Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[#2C1810] text-[#2C1810] hover:bg-[#2C1810] hover:text-[#F5F0E8] rounded-full px-8 py-6 text-lg font-medium"
              >
                <Link href="/products">View Products</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

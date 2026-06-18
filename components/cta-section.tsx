"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white shadow-2xl">
      <div className="text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-lp-green-900 mb-6"
            animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            style={{
              backgroundImage:
                "linear-gradient(90deg, #1a4d2e, #c9a227, #2d6a4f, #1a4d2e)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Everything Your Household Needs, Online
          </motion.h2>

          <p className="text-lp-green-600 text-lg mb-8 max-w-3xl mx-auto">
            Managing life in Verdant Acres just got easier. <br />
            <i>
              Book services, request gate passes, pay HOA dues, and stay in the
              loop with community announcements — all from the comfort of your
              home.
            </i>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(26, 77, 46, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full border-2 border-lp-green-700 bg-gradient-to-r from-lp-green-700 to-lp-green-600 text-white font-bold relative overflow-hidden"
              >
                <span className="relative z-10">Our Services</span>
              </motion.button>
            </Link>

            <Link href="/contact">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(201, 162, 39, 0.1)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full border-2 border-lp-green-700 text-lp-green-700 font-bold transition-colors"
              >
                Contact VAVA
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

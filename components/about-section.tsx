"use client";

import { motion } from "framer-motion";
import { Target, Eye, Heart } from "lucide-react";
import Image from "next/image";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To foster a safe, clean, and well-organized community in Verdant Acres where every resident's voice is heard and every concern is acted upon.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "A livable, greener, and more resilient Verdant Acres Subdivision — a true home for every family in Pamplona Tres, Las Piñas City.",
  },
  {
    icon: Heart,
    title: "Our Values",
    description:
      "Community spirit, transparency, inclusivity, and dedicated service to all Verdant Acres homeowners and residents.",
  },
];

export default function AboutSection() {
  return (
    <>
      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-lp-green-800 mb-4">
              Our Commitment to the Community
            </h2>
            <p className="text-lg text-lp-green-600 max-w-2xl mx-auto">
              Building a better Verdant Acres through active and dedicated
              homeowners' association service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-lp-green-50 border border-lp-green-100 text-center hover:shadow-lg hover:border-lp-green-200 transition-all group"
                >
                  <motion.div
                    className="flex justify-center mb-6"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="p-4 bg-lp-green-600 rounded-2xl shadow-lg group-hover:bg-lp-green-700 transition-colors">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-bold text-lp-green-800 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-lp-green-600 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-lp-green-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/verdant-acres-logo.png"
                alt="Verdant Acres Subdivision"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-lp-green-900/40 to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-lp-green-800">
                About Verdant Acres Subdivision
              </h2>
              <p className="text-lg text-lp-green-700 leading-relaxed">
                Verdant Acres Subdivision is a residential community located
                along Villa Cristina Avenue, Pamplona Tres, Las Piñas City. Home
                to families and individuals, it offers a peaceful yet accessible
                lifestyle within Metro Manila's southern corridor.
              </p>
              <p className="text-lg text-lp-green-700 leading-relaxed">
                The{" "}
                <strong>
                  Verdant Acres Villagers Association, Inc. (VAVA)
                </strong>{" "}
                is dedicated to making our subdivision more livable, greener,
                and resilient. Through community-driven programs and active
                governance, VAVA works to address residents' concerns and
                continuously improve the quality of life within our village.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-white rounded-xl border border-lp-green-200">
                  <p className="text-3xl font-bold text-lp-gold-600">
                    Pamplona
                  </p>
                  <p className="text-sm text-lp-green-600">
                    Tres, Las Piñas City
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-lp-green-200">
                  <p className="text-3xl font-bold text-lp-gold-600">VAVA</p>
                  <p className="text-sm text-lp-green-600">
                    Villagers Association Inc.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-lp-green-800 mb-4">
              Community Amenities
            </h2>
            <p className="text-lp-green-600 max-w-xl mx-auto">
              Verdant Acres provides everyday conveniences right within the
              subdivision
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Basketball Court", sub: "Multi-purpose hall" },
              { label: "Drugstore", sub: "Citidrug 2-in-1" },
              { label: "Water Station", sub: "CDR Water Station" },
              { label: "Laundry Shop", sub: "Sparkle Wash" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="p-5 rounded-2xl bg-lp-green-50 border border-lp-green-100 text-center hover:shadow-md transition-all"
              >
                <p className="font-bold text-lp-green-800">{item.label}</p>
                <p className="text-sm text-lp-green-600 mt-1">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-lp-green-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <h2 className="text-3xl font-bold text-lp-green-800 mb-4">
              Find Us
            </h2>
            <p className="text-lp-green-600">
              Villa Cristina Avenue, Pamplona Tres, Las Piñas City
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-lg border border-lp-green-200"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3863.8!2d120.9820!3d14.4480!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zVmVyZGFudCBBY3JlcyBTdWJkaXZpc2lvbg!5e0!3m2!1sen!2sph"
              width="100%"
              height="450"
              style={{ border: 0 }}
              title="Verdant Acres Subdivision Location"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}

"use client"

import { motion } from "framer-motion"

interface PageHeroBannerProps {
  title: string
  subtitle: string
  image?: string
}

export default function PageHeroBanner({ title, subtitle, image }: PageHeroBannerProps) {
  return (
    <div className="relative w-full min-h-[350px] md:min-h-[420px] overflow-hidden pt-16 md:pt-20">
      {/* Background image (if provided) */}
      {image && (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
      )}

      {/* Rich layered gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-lp-green-900/80 via-lp-green-800/70 to-lp-green-900/80" />

      {/* Radial gradient overlays */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-lp-gold-500/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-lp-green-600/30 via-transparent to-transparent" />
      </div>

      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-lp-gold-400/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lp-green-500/20 rounded-full blur-3xl"
      />



      {/* City seal watermark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.12, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute right-4 md:right-20 top-1/2 -translate-y-1/2"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-lp-gold-400/20 rounded-full blur-2xl scale-110" />
          <img src="/images/image.png" alt="" className="relative w-32 md:w-48 lg:w-56 drop-shadow-2xl" />
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <span className="text-xs md:text-sm font-medium text-lp-gold-200 tracking-wider uppercase">
            City of Las Piñas
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-lp-gold-100 max-w-2xl leading-relaxed"
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  )
}
"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Home, Users, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  const stats = [
    { label: "Homeowners & Residents", value: "300+", icon: Users },
    { label: "Community Amenities", value: "5+", icon: Home },
    { label: "Pamplona Tres, Las Piñas", value: "📍", icon: MapPin },
    { label: "VAVA Support", value: "24/7", icon: Clock },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0F3A1A 0%, #1A5C2A 45%, #0F3A1A 100%)",
        }}
      />

      {/* Decorative side pipes */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-15 hidden lg:flex flex-col items-center gap-1">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: 80 + Math.sin(i * 0.5) * 40 }}
            transition={{ delay: i * 0.1, duration: 0.8 }}
            className="w-3 rounded-t-full"
            style={{ background: "linear-gradient(to top, #4CAF6B, #A8D5B5)" }}
          />
        ))}
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-15 hidden lg:flex flex-col items-center gap-1">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: 80 + Math.sin((11 - i) * 0.5) * 40 }}
            transition={{ delay: i * 0.1, duration: 0.8 }}
            className="w-3 rounded-t-full"
            style={{ background: "linear-gradient(to top, #4CAF6B, #A8D5B5)" }}
          />
        ))}
      </div>

      {/* Floating ambient glows */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-[15%] w-40 h-40 rounded-full blur-3xl"
        style={{ background: "rgba(76,175,107,0.25)" }}
      />
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.15, 0.3, 0.15] }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-20 right-[15%] w-56 h-56 rounded-full blur-3xl"
        style={{ background: "rgba(46,125,64,0.3)" }}
      />

      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background:
            "linear-gradient(90deg, transparent, #FFFFFF 40%, #4CAF6B 60%, transparent)",
        }}
      />

      {/* VA logo watermark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.12, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block"
      >
        <img
          src="/verdant-acres-logo.png"
          alt=""
          className="w-[400px] h-[400px] object-contain"
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "#A8D5B5",
                }}
              >
                <Sparkles className="w-4 h-4" />
                Welcome to Verdant Acres
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-balance"
            >
              <span className="text-white">Your Home, Our</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #A8D5B5, #4CAF6B, #A8D5B5)",
                }}
              >
                Community, Our Pride
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed text-pretty"
              style={{ color: "#C8E6C9" }}
            >
              Verdant Acres Villagers Association (VAVA) is committed to making
              our subdivision in Pamplona Tres, Las Piñas City more livable,
              greener, and resilient — one neighbor at a time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/services"
                className="group px-8 py-4 rounded-full font-bold transition-all hover:scale-105 flex items-center justify-center gap-2 text-white"
                style={{
                  background: "linear-gradient(135deg, #4CAF6B, #2E7D40)",
                  boxShadow: "0 4px 20px rgba(76,175,107,0.35)",
                }}
              >
                Explore Services
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 text-white border-2"
                style={{ borderColor: "rgba(255,255,255,0.3)" }}
              >
                About VAVA
              </Link>
            </motion.div>
          </div>

          {/* Right — Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:grid grid-cols-2 gap-4 auto-rows-fr"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              const isAccent = i % 2 === 1;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="p-6 rounded-2xl border transition-all h-full min-h-[160px] flex flex-col justify-center"
                  style={{
                    background: isAccent
                      ? "rgba(76,175,107,0.2)"
                      : "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)",
                    borderColor: isAccent
                      ? "rgba(76,175,107,0.35)"
                      : "rgba(255,255,255,0.15)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: isAccent
                        ? "rgba(76,175,107,0.3)"
                        : "rgba(255,255,255,0.15)",
                    }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: isAccent ? "#A8D5B5" : "#FFFFFF" }}
                    />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: isAccent ? "#A8D5B5" : "#C8E6C9" }}
                  >
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Mobile Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="lg:hidden mt-12 grid grid-cols-2 gap-4 auto-rows-fr"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-xl border text-center h-full min-h-[120px] flex flex-col items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  borderColor: "rgba(255,255,255,0.15)",
                }}
              >
                <Icon className="w-6 h-6 mb-2" style={{ color: "#4CAF6B" }} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs" style={{ color: "#C8E6C9" }}>
                  {stat.label}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-3 mt-16"
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "#4CAF6B" }}
          />
          <div
            className="w-24 h-0.5 rounded-full"
            style={{
              background: "linear-gradient(to right, #4CAF6B, transparent)",
            }}
          />
          <div
            className="w-3 h-3 rounded-full ring-4"
            style={{
              background: "#4CAF6B",
              boxShadow: "0 0 0 4px rgba(76,175,107,0.3)",
            }}
          />
          <div
            className="w-24 h-0.5 rounded-full"
            style={{
              background: "linear-gradient(to left, #4CAF6B, transparent)",
            }}
          />
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "#4CAF6B" }}
          />
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to top, var(--background), transparent)",
        }}
      />
    </section>
  );
}

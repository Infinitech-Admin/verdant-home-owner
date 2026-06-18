"use client"

import type React from "react"

import Header from "@/components/header"
import Footer from "@/components/footer"
import PageHeroBanner from "@/components/page-hero-banner"

interface PageLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  image?: string // ✅ Added this
}

export default function PageLayout({
  children,
  title,
  subtitle,
  image,       // ✅ Accept it here
}: PageLayoutProps) {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <PageHeroBanner
        title={title}
        subtitle={subtitle || ""}
        image={image} // ✅ Pass it to the hero banner
      />
      {children}
      <Footer />
    </main>
  )
}

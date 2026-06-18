import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import CookieConsent from "@/components/cookie-consent";
import ServiceWorkerProvider from "@/components/ServiceWorkerProvider";
import FloatingSocialMedia from "@/components/FloatingSocialMedia";
import Chatbot from "@/components/Chatbot";

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://verdantacres.com.ph/"),

  title: {
    default: "Verdant Acres | Official Community Portal",
    template: "%s | Verdant Acres Subdivision",
  },

  description:
    "Official portal of Verdant Acres Subdivision, Villa Cristina Ave, Pamplona Tres, Las Piñas City. Access community updates, homeowner services, announcements, and local resources. Your gateway to comfortable community living in Metro Manila.",

  keywords: [
    "Verdant Acres",
    "Verdant Acres Subdivision",
    "Pamplona Tres",
    "Las Piñas City",
    "Metro Manila",
    "residential community",
    "subdivision portal",
    "homeowners association",
    "Las Piñas subdivision",
    "Villa Cristina Ave",
    "house and lot Las Piñas",
    "townhouse Las Piñas",
    "NCR",
    "South Manila",
  ],

  authors: [{ name: "Verdant Acres Homeowners Association" }],
  creator: "Verdant Acres Homeowners Association",
  publisher: "Verdant Acres Homeowners Association",
  generator: "Next.js",
  applicationName: "Verdant Acres Community Portal",
  referrer: "origin-when-cross-origin",
  manifest: "/manifest.json",

  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://verdantacres.com.ph/",
    title: "Verdant Acres | Official Community Portal",
    description:
      "Official portal of Verdant Acres Subdivision in Pamplona Tres, Las Piñas — your hub for community news, homeowner services, and neighborhood resources.",
    siteName: "Verdant Acres Community Portal",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Verdant Acres Subdivision - Official Community Portal",
      },
    ],
    countryName: "Philippines",
  },

  twitter: {
    card: "summary_large_image",
    title: "Verdant Acres | Official Community Portal",
    description:
      "Official portal of Verdant Acres Subdivision providing seamless access to community services and homeowner updates in Las Piñas City.",
    images: ["/twitter-image.png"],
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Verdant Acres",
    startupImage: [
      {
        url: "/apple-splash-2048-2732.png",
        media: "(device-width: 1024px) and (device-height: 1366px)",
      },
    ],
  },

  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/icon512_rounded.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/apple-icon.png" },
      { url: "/icon512_rounded.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon512_rounded.png",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },

  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },

  alternates: {
    canonical: "https://verdantacres.com.ph/",
    languages: {
      "en-PH": "https://verdantacres.com.ph/",
      "fil-PH": "https://verdantacres.com.ph/fil",
    },
  },

  category: "real estate",

  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3a7d44" },
    { media: "(prefers-color-scheme: dark)", color: "#1e4d28" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Residential Community Schema
  const residentialSchema = {
    "@context": "https://schema.org",
    "@type": "Residence",
    "@id": "https://verdantacres.com.ph/#residence",
    name: "Verdant Acres Subdivision",
    url: "https://verdantacres.com.ph/",
    logo: "https://verdantacres.com.ph/icon512_rounded.png",
    description:
      "Verdant Acres Subdivision is a residential community located along Villa Cristina Ave, Pamplona Tres, Las Piñas City offering house and lot units, townhouses, and apartments.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Villa Cristina Ave, Pamplona Tres",
      addressLocality: "Las Piñas City",
      addressRegion: "Metro Manila",
      postalCode: "1742",
      addressCountry: "PH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "14.4391",
      longitude: "120.9947",
    },
    areaServed: {
      "@type": "City",
      name: "Las Piñas City",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "homeowners association",
      email: "info@verdantacres.com.ph",
    },
    sameAs: ["https://www.facebook.com/VAVA.LasPinas.ph"],
  };

  // LocalBusiness Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://verdantacres.com.ph/#localbusiness",
    name: "Verdant Acres Homeowners Association",
    image: "https://verdantacres.com.ph/og-image.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Villa Cristina Ave, Pamplona Tres",
      addressLocality: "Las Piñas City",
      addressRegion: "Metro Manila",
      postalCode: "1742",
      addressCountry: "Philippines",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "14.4391",
      longitude: "120.9947",
    },
    url: "https://verdantacres.com.ph/",
  };

  // WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://verdantacres.com.ph/#website",
    url: "https://verdantacres.com.ph/",
    name: "Verdant Acres Community Portal",
    description: "Official Community Portal of Verdant Acres Subdivision",
    publisher: {
      "@id": "https://verdantacres.com.ph/#residence",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://verdantacres.com.ph/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en-PH">
      <head>
        {/* Primary Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(residentialSchema),
          }}
        />

        {/* LocalBusiness Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />

        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Open Graph Image Tags */}
        <meta
          property="og:image"
          content="https://verdantacres.com.ph/og-image.png"
        />
        <meta
          property="og:image:secure_url"
          content="https://verdantacres.com.ph/og-image.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Verdant Acres Subdivision - Official Community Portal"
        />

        {/* Twitter Card Image */}
        <meta
          name="twitter:image"
          content="https://verdantacres.com.ph/twitter-image.png"
        />
        <meta
          name="twitter:image:alt"
          content="Verdant Acres Community Portal"
        />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

        {/* Geographic meta tags */}
        <meta name="geo.region" content="PH-NCR" />
        <meta name="geo.placename" content="Las Piñas City" />
        <meta name="geo.position" content="14.4391;120.9947" />
        <meta name="ICBM" content="14.4391, 120.9947" />

        {/* Additional meta tags */}
        <meta name="format-detection" content="telephone=yes" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="target" content="all" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />

        {/* Location meta */}
        <meta property="place:location:latitude" content="14.4391" />
        <meta property="place:location:longitude" content="120.9947" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://verdantacres.com.ph/" />

        {/* Alternative languages */}
        <link
          rel="alternate"
          hrefLang="en-ph"
          href="https://verdantacres.com.ph/"
        />
        <link
          rel="alternate"
          hrefLang="fil-ph"
          href="https://verdantacres.com.ph/fil"
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://verdantacres.com.ph/"
        />
      </head>
      <body
        className={`${geist.className} ${geistMono.className} font-sans antialiased overflow-x-hidden`}
      >
        <ServiceWorkerProvider />
        <div className="min-h-screen">{children}</div>
        <FloatingSocialMedia />
        <Chatbot />
        <CookieConsent />
        <Toaster />
      </body>
    </html>
  );
}

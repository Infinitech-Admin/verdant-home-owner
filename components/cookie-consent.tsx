"use client"

import { useEffect, useState } from "react"
import { X, Cookie } from "lucide-react"

declare global {
  interface Window {
    gtag?: (command: string, action: string, params: Record<string, string>) => void
  }
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookie-consent")
    if (!cookieConsent) {
      setIsVisible(true)
    }
    setIsLoading(false)
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    localStorage.setItem("cookie-consent-date", new Date().toISOString())
    window.gtag?.("consent", "update", {
      analytics_storage: "granted",
    })
    setIsVisible(false)
  }

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected")
    localStorage.setItem("cookie-consent-date", new Date().toISOString())
    setIsVisible(false)
  }

  if (!isVisible || isLoading) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-6 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto">
        <div className="bg-gradient-to-r from-lp-green-700 to-lp-green-600 rounded-lg shadow-2xl p-4 md:p-6 text-white border border-lp-gold-500/30">
          <div className="flex items-start gap-4">
            <div className="bg-lp-gold-500/20 p-2 rounded-full">
              <Cookie className="w-6 h-6 flex-shrink-0 text-lp-gold-400" />
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2 text-white">Cookie Preferences</h3>
              <p className="text-sm md:text-base text-white/90 mb-4">
                We use cookies to improve your experience on our website. These help us understand how you use the site
                and enable performance analytics. By accepting, you help us serve you better.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <a
                  href="/cookies"
                  className="text-lp-gold-300 underline text-sm hover:text-lp-gold-200 transition-colors"
                >
                  Learn more
                </a>

                <div className="flex gap-3 flex-1 sm:flex-initial sm:ml-auto">
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium transition-colors text-sm"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleAccept}
                    className="px-4 py-2 rounded-lg bg-lp-gold-500 text-lp-green-900 font-medium hover:bg-lp-gold-400 transition-colors text-sm"
                  >
                    Accept Cookies
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleReject}
              className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
              aria-label="Close cookie banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

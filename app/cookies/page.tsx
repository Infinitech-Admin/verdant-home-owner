"use client"

import { motion } from "framer-motion"
import PageLayout from "@/components/page-layout"
import { Cookie, ListChecks, Settings, Users, Mail } from "lucide-react"

const sections = [
  {
    id: 1,
    icon: Cookie,
    title: "What Are Cookies?",
    content:
      "Cookies are small pieces of text stored on your device when you visit websites. They help websites remember your preferences and provide a better user experience. Cookies can be either session cookies (deleted when you close your browser) or persistent cookies (remain on your device).",
  },
  {
    id: 2,
    icon: ListChecks,
    title: "Types of Cookies We Use",
    content: "Our website uses the following types of cookies:",
    list: [
      "Essential Cookies: Required for basic website functionality",
      "Analytical Cookies: Help us understand how you use our website",
      "Preference Cookies: Remember your preferences and choices",
    ],
  },
  {
    id: 3,
    icon: Settings,
    title: "Managing Your Cookies",
    content:
      "You can control and manage cookies in your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent. Please note that blocking some cookies may impact the functionality of our website.",
  },
  {
    id: 4,
    icon: Users,
    title: "Third-Party Cookies",
    content:
      "In addition to our own cookies, we may allow third parties to place cookies on your device for analytics and advertising purposes. We encourage you to review their privacy policies to understand their cookie practices.",
  },
  {
    id: 5,
    icon: Mail,
    title: "Contact Us",
    content:
      "If you have questions about our cookie policy, please contact us at info@laspinas.gov.ph or call (02) 8874-5050.",
  },
]

export default function CookiesPage() {
  return (
    <PageLayout title="Cookie Policy" subtitle="How we use cookies on our website">
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lp-green-500 mb-12 text-center">
            Last updated: November 2024
          </motion.p>

          <div className="space-y-8">
            {sections.map((section, i) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-md border border-lp-green-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-lp-green-100 flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-lp-green-700" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-lp-green-800 mb-3">
                      {section.id}. {section.title}
                    </h2>
                    <p className="text-lp-green-600 leading-relaxed">{section.content}</p>
                    {section.list && (
                      <ul className="mt-4 space-y-2">
                        {section.list.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-lp-green-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-lp-gold-500 mt-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

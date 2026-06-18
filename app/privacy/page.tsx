"use client"

import { motion } from "framer-motion"
import PageLayout from "@/components/page-layout"
import { Info, Database, Settings, Lock, RefreshCw } from "lucide-react"

const sections = [
  {
    id: 1,
    icon: Info,
    title: "Introduction",
    content:
      "The City of Las Piñas Government operates this website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service and the choices you have associated with that data.",
  },
  {
    id: 2,
    icon: Database,
    title: "Information Collection",
    content:
      "We collect several different types of information for various purposes to provide and improve our service to you.",
    list: [
      "Personal Data: Name, email address, phone number, and other identifying information",
      "Usage Data: Information about how you use our website, including IP address, browser type, pages visited",
      "Cookies: Small data files stored on your device to enhance user experience",
    ],
  },
  {
    id: 3,
    icon: Settings,
    title: "Use of Data",
    content: "The City of Las Piñas Government uses the collected data for various purposes:",
    list: [
      "To provide and maintain our service",
      "To notify you about changes to our service",
      "To allow you to participate in interactive features of our service",
      "To provide customer care and support",
      "To gather analysis or valuable information to improve our service",
    ],
  },
  {
    id: 4,
    icon: Lock,
    title: "Security of Data",
    content:
      "The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.",
  },
  {
    id: 5,
    icon: RefreshCw,
    title: "Changes to This Privacy Policy",
    content:
      "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date at the top of this Privacy Policy.",
  },
]

export default function PrivacyPage() {
  return (
    <PageLayout title="Privacy Policy" subtitle="Your privacy is important to us">
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
                  <div className="w-12 h-12 rounded-xl bg-lp-gold-100 flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-lp-gold-600" />
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

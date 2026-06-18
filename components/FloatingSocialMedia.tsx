'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Facebook, Instagram, Mail, Phone, Globe } from 'lucide-react'
import { XIcon } from '@/components/icons'

export default function FloatingSocialMedia() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Hide on dashboard, login, and register routes
  if (pathname?.startsWith('/dashboard') || pathname === '/login' || pathname === '/register') {
    return null
  }

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://www.facebook.com/cityoflaspinasofficial/',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/laspinascity/', // Replace with actual Instagram
      color: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600'
    },
    {
      name: 'Twitter',
      icon: XIcon,
      url: 'https://twitter.com/laspinascity', // Replace with actual Twitter/X
      color: 'bg-black hover:bg-gray-900'
    },
    {
      name: 'Email',
      icon: Mail,
      url: 'mailto:laspinascitygov@yahoo.com',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      name: 'Phone',
      icon: Phone,
      url: 'tel:+6328874-5050', // Las Piñas City Hall number
      color: 'bg-lp-green-600 hover:bg-lp-green-700'
    }
  ]

  return (
    <>
      {/* Desktop View - Always show all icons */}
      <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
        {socialLinks.map((social, index) => (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${social.color} text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl group relative`}
            aria-label={social.name}
          >
            <social.icon className="w-6 h-6" />
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {social.name}
            </span>
          </a>
        ))}
      </div>

      {/* Mobile View - Expandable menu */}
      <div className="md:hidden fixed right-4 top-1/2 -translate-y-1/2 z-40">
        {/* Globe Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-gradient-to-r from-lp-green-600 to-lp-green-500 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
          aria-label="Social Media Menu"
        >
          <Globe className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {/* Expanded Social Icons */}
        {isExpanded && (
          <div className="absolute right-0 bottom-full mb-3 flex flex-col gap-2 z-50">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${social.color} text-white p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl animate-in slide-in-from-right`}
                style={{ animationDelay: `${index * 50}ms` }}
                aria-label={social.name}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes slide-in-from-right {
          from {
            transform: translateX(20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-in {
          animation: slide-in-from-right 0.3s ease-out forwards;
        }
      `}</style>
    </>
  )
}
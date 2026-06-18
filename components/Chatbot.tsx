"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bot, X, Send } from "lucide-react";

interface Message {
  type: "bot" | "user";
  text: string;
  quickReplies?: string[];
}

export default function Chatbot() {
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showPromoMessage, setShowPromoMessage] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      text: "Hi there! 👋 I'm your Verdant Acres community assistant. How can I help you today?",
      quickReplies: [
        "Our Mission",
        "Our Vision",
        "Our Values",
        "Contact VAVA",
        "Office Hours",
        "Amenities",
        "How to Register",
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (
    pathname?.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  const handleSendMessage = (message?: string) => {
    const messageToSend = message || inputMessage;
    if (messageToSend.trim() === "") return;

    setMessages((prev) => [...prev, { type: "user", text: messageToSend }]);

    setTimeout(() => {
      const botResponse = getBotResponse(messageToSend);
      setMessages((prev) => [...prev, botResponse]);
    }, 800);

    setInputMessage("");
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const getBotResponse = (message: string): Message => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("mission") || lowerMessage === "our mission") {
      return {
        type: "bot",
        text: "🎯 Our Mission:\n\nTo foster a safe, clean, and well-organized community in Verdant Acres where every resident's voice is heard and every concern is acted upon by the Verdant Acres Villagers Association (VAVA).",
        quickReplies: ["Our Vision", "Our Values", "Contact VAVA", "Amenities"],
      };
    } else if (
      lowerMessage.includes("vision") ||
      lowerMessage === "our vision"
    ) {
      return {
        type: "bot",
        text: "🌟 Our Vision:\n\nA livable, greener, and more resilient Verdant Acres Subdivision — a true home for every family in Pamplona Tres, Las Piñas City where neighbors thrive together.",
        quickReplies: [
          "Our Mission",
          "Our Values",
          "Contact VAVA",
          "Amenities",
        ],
      };
    } else if (
      lowerMessage.includes("values") ||
      lowerMessage === "our values"
    ) {
      return {
        type: "bot",
        text: "💎 Our Values:\n\n• Community Spirit - We look out for one another\n• Transparency - VAVA operates openly and accountably\n• Inclusivity - Every resident's voice matters\n• Service - We are dedicated to improving your daily life\n• Resilience - We build a stronger neighborhood together",
        quickReplies: [
          "Our Mission",
          "Our Vision",
          "Contact VAVA",
          "Office Hours",
        ],
      };
    } else if (
      lowerMessage.includes("amenit") ||
      lowerMessage === "amenities"
    ) {
      return {
        type: "bot",
        text: "🏡 Verdant Acres Amenities:\n\n• 🏀 Basketball Court / Multi-purpose Hall\n• 💊 Citidrug 2-in-1 Drugstore\n• 💧 CDR Water Station\n• 🧺 Sparkle Wash Laundry Shop\n• 🛒 BDO Alfamart\n\nAll conveniently located within the subdivision for everyday needs!",
        quickReplies: ["Location", "Contact VAVA", "Services", "Our Mission"],
      };
    } else if (
      lowerMessage.includes("location") ||
      lowerMessage.includes("where") ||
      lowerMessage.includes("address") ||
      lowerMessage.includes("find")
    ) {
      return {
        type: "bot",
        text: "📍 Find Us:\n\nVerdant Acres Subdivision\nVilla Cristina Avenue\nPamplona Tres, Las Piñas City\nMetro Manila, Philippines\n\nNearby landmarks:\n• SM Center Las Piñas (~0.7 km)\n• Vista Mall Las Piñas (~0.7 km)\n• Las Piñas City Hall (~nearby)\n\nAccessible via Alabang-Zapote Road jeepneys and buses.",
        quickReplies: [
          "Office Hours",
          "Contact VAVA",
          "Amenities",
          "Our Mission",
        ],
      };
    } else if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("kumusta") ||
      lowerMessage.includes("mabuhay")
    ) {
      return {
        type: "bot",
        text: "Mabuhay! 👋 Welcome to Verdant Acres! I'm here to help you with community services and information. What can I assist you with?",
        quickReplies: [
          "Our Mission",
          "Amenities",
          "Contact VAVA",
          "Office Hours",
          "How to Register",
        ],
      };
    } else if (
      lowerMessage.includes("service") ||
      lowerMessage.includes("services")
    ) {
      return {
        type: "bot",
        text: "🏘️ VAVA Community Services:\n\n• Community announcements & updates\n• Resident concern reporting\n• Community event coordination\n• Subdivision gate & security coordination\n• Maintenance request assistance\n• Association dues management\n• Document requests (clearances, certifications)\n\nWhat specific service do you need?",
        quickReplies: [
          "Contact VAVA",
          "Office Hours",
          "How to Register",
          "Amenities",
        ],
      };
    } else if (
      lowerMessage.includes("contact") ||
      lowerMessage === "contact vava"
    ) {
      return {
        type: "bot",
        text: "📞 Contact VAVA:\n\n• 📘 Facebook: Verdant Acres Villagers Association - VAVA INC\n  facebook.com/VAVA.LasPinas.ph\n\n• 📍 Address: Villa Cristina Ave, Pamplona Tres, Las Piñas City\n\nFor urgent community concerns, you may also visit the VAVA office during office hours.",
        quickReplies: ["Office Hours", "Location", "Services", "Our Mission"],
      };
    } else if (
      lowerMessage.includes("hours") ||
      lowerMessage.includes("time") ||
      lowerMessage.includes("schedule") ||
      lowerMessage === "office hours"
    ) {
      return {
        type: "bot",
        text: "🕐 VAVA Office Hours:\n\nMonday to Friday\n8:00 AM - 5:00 PM\n\nThe VAVA office is closed on weekends and public holidays. For urgent matters outside office hours, please message us on Facebook.",
        quickReplies: ["Contact VAVA", "Location", "Services"],
      };
    } else if (
      lowerMessage.includes("register") ||
      lowerMessage === "how to register"
    ) {
      return {
        type: "bot",
        text: "📝 How to Register:\n\nTo create a resident account on our community portal:\n\n1. Click 'Register' on the website\n2. Fill in your name, email, phone, and address\n3. Upload a proof of residency (utility bill, lease contract, or barangay certificate)\n4. Set your password\n5. Wait for VAVA officer approval (1–3 business days)\n\nYou'll get an email once your account is approved!",
        quickReplies: [
          "Contact VAVA",
          "Office Hours",
          "Services",
          "Our Mission",
        ],
      };
    } else if (
      lowerMessage.includes("dues") ||
      lowerMessage.includes("association") ||
      lowerMessage.includes("fee")
    ) {
      return {
        type: "bot",
        text: "💳 Association Dues:\n\nFor inquiries about homeowners association dues, payment schedules, or billing concerns, please contact the VAVA office directly:\n\n• Visit during office hours (Mon–Fri, 8AM–5PM)\n• Message us on Facebook: facebook.com/VAVA.LasPinas.ph\n\nOur team will be happy to assist you.",
        quickReplies: ["Office Hours", "Contact VAVA", "Services"],
      };
    } else if (
      lowerMessage.includes("security") ||
      lowerMessage.includes("gate") ||
      lowerMessage.includes("guard")
    ) {
      return {
        type: "bot",
        text: "🔐 Subdivision Security:\n\nVerdant Acres maintains community security for all residents. For security-related concerns such as gate passes, visitor access, or incidents, please:\n\n• Coordinate with the VAVA office\n• Message us on Facebook for urgent reports\n\nYour safety is our priority!",
        quickReplies: ["Contact VAVA", "Office Hours", "Services"],
      };
    } else if (
      lowerMessage.includes("event") ||
      lowerMessage.includes("activity") ||
      lowerMessage.includes("program")
    ) {
      return {
        type: "bot",
        text: "🎉 Community Events:\n\nVAVA regularly organizes community activities for Verdant Acres residents. Stay updated on:\n\n• Community clean-up drives\n• Holiday celebrations\n• Sports events at the basketball court\n• Barangay health programs\n\nFollow our Facebook page for the latest announcements:\nfacebook.com/VAVA.LasPinas.ph",
        quickReplies: ["Contact VAVA", "Amenities", "Services"],
      };
    } else if (
      lowerMessage.includes("thank") ||
      lowerMessage.includes("salamat")
    ) {
      return {
        type: "bot",
        text: "Walang anuman! 😊 It's our pleasure to serve the Verdant Acres community. Feel free to reach out anytime. Go Verdant! 🌿",
        quickReplies: ["Our Mission", "Services", "Contact VAVA"],
      };
    } else {
      return {
        type: "bot",
        text: "Salamat for your message! 🌿 For more detailed assistance, please reach out to us directly:\n\n• Facebook: facebook.com/VAVA.LasPinas.ph\n• Visit: Villa Cristina Ave, Pamplona Tres, Las Piñas\n• Office Hours: Mon–Fri, 8AM–5PM",
        quickReplies: [
          "Our Mission",
          "Services",
          "Contact VAVA",
          "Office Hours",
          "Amenities",
        ],
      };
    }
  };

  return (
    <>
      {/* Floating Promo Message */}
      {showPromoMessage && !isChatOpen && (
        <div className="fixed bottom-24 right-6 bg-white rounded-2xl shadow-2xl z-50 p-4 max-w-xs border-2 border-lp-green-500 animate-bounce-slow">
          <button
            onClick={() => setShowPromoMessage(false)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
            aria-label="Close message"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-3">
            <div className="bg-lp-green-100 p-2 rounded-full flex-shrink-0">
              <Bot className="w-6 h-6 text-lp-green-600" />
            </div>
            <div>
              <p className="font-bold text-lp-green-800 text-sm mb-1">
                Mabuhay! 💬
              </p>
              <p className="text-lp-green-600 text-xs">
                Chat with the VAVA assistant for quick community help!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chatbot Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-lp-green-700 to-lp-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group"
        aria-label="Open Chatbot"
      >
        {isChatOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <Bot className="w-7 h-7 animate-pulse" />
        )}
        <span className="absolute -top-1 -right-1 bg-lp-gold-500 text-lp-green-900 text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce font-bold">
          !
        </span>
      </button>

      {/* Chatbot Window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[550px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-lp-green-200">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-lp-green-700 to-lp-green-600 text-white p-4 flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-full overflow-hidden w-10 h-10 flex items-center justify-center flex-shrink-0">
              <img
                src="/verdant-acres-logo.png"
                alt="Verdant Acres"
                className="w-7 h-7 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement!.innerHTML = `<span style="font-size:0.75rem;font-weight:700;color:#1A5C2A">VA</span>`;
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base leading-tight">
                VAVA Community Assistant
              </h3>
              <p className="text-xs text-lp-green-100">
                Verdant Acres · Pamplona Tres, Las Piñas
              </p>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="hover:bg-lp-green-800 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-lp-green-50/50">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      message.type === "user"
                        ? "bg-lp-green-700 text-white rounded-br-none"
                        : "bg-white text-lp-green-800 shadow-sm rounded-bl-none border border-lp-green-100"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">
                      {message.text}
                    </p>
                  </div>
                </div>

                {message.type === "bot" && message.quickReplies && (
                  <div className="mt-3 flex flex-wrap gap-2 justify-start">
                    {message.quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickReply(reply)}
                        className="px-4 py-2 text-xs bg-white border-2 border-lp-green-500 text-lp-green-700 rounded-full hover:bg-lp-green-500 hover:text-white transition-colors duration-200 shadow-sm font-medium"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-lp-green-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about Verdant Acres..."
                className="flex-1 px-4 py-2 border border-lp-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-lp-green-500 focus:border-transparent text-sm"
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-lp-green-700 text-white p-2 rounded-full hover:bg-lp-green-800 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        @media (max-width: 640px) {
          .fixed.bottom-24.right-6.w-96 {
            width: calc(100vw - 2rem);
            right: 1rem;
            left: 1rem;
            bottom: 5rem;
            height: calc(100vh - 10rem);
            max-height: 550px;
          }
          .fixed.bottom-24.right-6.max-w-xs {
            right: 1rem;
            left: 1rem;
            max-width: calc(100vw - 2rem);
            bottom: 6rem;
          }
          .fixed.bottom-6.right-6 {
            bottom: 1rem;
            right: 1rem;
          }
        }
      `}</style>
    </>
  );
}

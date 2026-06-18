"use client";

import { useState } from "react";
import { ArrowLeft, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CitizenLayout from "@/components/citizenLayout";

export default function CitizenGuidePage() {
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleExpanded = (key: string) => {
    setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const guides = [
    {
      category: "Getting Started",
      items: [
        {
          title: "How to Register",
          content:
            "Learn how to register as a resident of Verdant Acres and access all services.",
          fullContent: (
            <div className="space-y-4">
              <p className="text-sm" style={{ color: "#2E7D40" }}>
                To register and access all online services, follow these simple
                steps:
              </p>
              <div className="space-y-3">
                {[
                  {
                    step: "Step 1: Visit the Registration Page",
                    desc: "Go to the Account section and click on Register or Sign Up.",
                  },
                  {
                    step: "Step 2: Provide Personal Information",
                    desc: "Fill in your full name, email address, contact number, and complete address. Make sure all information is accurate.",
                  },
                  {
                    step: "Step 3: Set Your Password",
                    desc: "Create a strong password (minimum 8 characters) and confirm it. Use a mix of uppercase, lowercase, numbers, and symbols for better security.",
                  },
                  {
                    step: "Step 4: Complete Your Profile",
                    desc: "Upload a valid government-issued ID and a clear selfie photo. Files must be in PNG, JPG, or GIF format and not exceed 5MB.",
                  },
                ].map((s, i) => (
                  <div key={i}>
                    <h4
                      className="font-semibold text-sm mb-1"
                      style={{ color: "#1A5C2A" }}
                    >
                      {s.step}
                    </h4>
                    <p className="text-sm" style={{ color: "#2E7D40" }}>
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
              <div
                className="rounded-lg p-3 mt-2"
                style={{ background: "#E8F5E9", border: "1px solid #C8E6C9" }}
              >
                <p className="text-sm" style={{ color: "#0F3A1A" }}>
                  <strong>Note:</strong> Once registered, you can access all
                  online services including permit applications, document
                  requests, and more.
                </p>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      category: "Government Services",
      items: [
        {
          title: "Business Permit Application",
          content: "Step-by-step guide to apply for a business permit.",
          fullContent: (
            <div className="space-y-4">
              <p className="text-sm" style={{ color: "#2E7D40" }}>
                Applying for a business permit is now easier with our online
                application system.
              </p>
              <div className="space-y-3">
                <div>
                  <h4
                    className="font-semibold text-sm mb-2"
                    style={{ color: "#1A5C2A" }}
                  >
                    Requirements
                  </h4>
                  <ul
                    className="list-disc list-inside text-sm space-y-1"
                    style={{ color: "#2E7D40" }}
                  >
                    <li>
                      DTI Registration (sole proprietorship) or SEC Registration
                      (corporation)
                    </li>
                    <li>Barangay Business Clearance</li>
                    <li>Community Tax Certificate (Cedula)</li>
                    <li>Fire Safety Inspection Certificate</li>
                    <li>Sanitary Permit (for food establishments)</li>
                    <li>Contract of Lease or Proof of Ownership</li>
                    <li>Valid ID of the business owner</li>
                  </ul>
                </div>
                <div>
                  <h4
                    className="font-semibold text-sm mb-2"
                    style={{ color: "#1A5C2A" }}
                  >
                    Application Process
                  </h4>
                  <ol
                    className="list-decimal list-inside text-sm space-y-1"
                    style={{ color: "#2E7D40" }}
                  >
                    <li>Complete the online application form</li>
                    <li>Upload required documents</li>
                    <li>Pay the application fee</li>
                    <li>Wait for assessment (3–5 business days)</li>
                    <li>Receive notification for permit release</li>
                  </ol>
                </div>
                <div>
                  <h4
                    className="font-semibold text-sm mb-1"
                    style={{ color: "#1A5C2A" }}
                  >
                    Processing Time
                  </h4>
                  <p className="text-sm" style={{ color: "#2E7D40" }}>
                    New applications: 5–7 business days
                    <br />
                    Renewal: 3–5 business days
                  </p>
                </div>
              </div>
              <button
                className="w-full py-2.5 rounded-xl text-sm font-semibold mt-2 transition-all"
                style={{ background: "#1A5C2A", color: "#ffffff" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "#2E7D40")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "#1A5C2A")
                }
              >
                Apply for Business Permit
              </button>
            </div>
          ),
        },
        {
          title: "Building Permit Process",
          content:
            "Requirements and procedures for obtaining a building permit.",
          fullContent: (
            <div className="space-y-4">
              <p className="text-sm" style={{ color: "#2E7D40" }}>
                A building permit is required for any construction, renovation,
                or structural modification.
              </p>
              <div className="space-y-3">
                <div>
                  <h4
                    className="font-semibold text-sm mb-2"
                    style={{ color: "#1A5C2A" }}
                  >
                    Required Documents
                  </h4>
                  <ul
                    className="list-disc list-inside text-sm space-y-1"
                    style={{ color: "#2E7D40" }}
                  >
                    <li>
                      Building Plans (signed and sealed by a licensed
                      architect/engineer)
                    </li>
                    <li>Land Title or Tax Declaration</li>
                    <li>Barangay Clearance</li>
                    <li>Locational Clearance</li>
                    <li>Structural Analysis (for buildings over 2 stories)</li>
                    <li>Fire Safety Evaluation Clearance</li>
                    <li>
                      Environmental Compliance Certificate (if applicable)
                    </li>
                    <li>Valid ID of property owner</li>
                  </ul>
                </div>
                <div>
                  <h4
                    className="font-semibold text-sm mb-2"
                    style={{ color: "#1A5C2A" }}
                  >
                    Types of Building Permits
                  </h4>
                  <ul
                    className="list-disc list-inside text-sm space-y-1"
                    style={{ color: "#2E7D40" }}
                  >
                    <li>
                      <strong style={{ color: "#1A5C2A" }}>
                        New Construction:
                      </strong>{" "}
                      For building new structures
                    </li>
                    <li>
                      <strong style={{ color: "#1A5C2A" }}>Renovation:</strong>{" "}
                      For major repairs or modifications
                    </li>
                    <li>
                      <strong style={{ color: "#1A5C2A" }}>Addition:</strong>{" "}
                      For expanding existing structures
                    </li>
                    <li>
                      <strong style={{ color: "#1A5C2A" }}>Repair:</strong> For
                      minor structural repairs
                    </li>
                  </ul>
                </div>
                <div>
                  <h4
                    className="font-semibold text-sm mb-1"
                    style={{ color: "#1A5C2A" }}
                  >
                    Processing Timeline
                  </h4>
                  <p className="text-sm" style={{ color: "#2E7D40" }}>
                    Simple structures (1–2 floors): 7–10 business days
                    <br />
                    Complex structures (3+ floors): 15–20 business days
                  </p>
                </div>
              </div>
              <button
                className="w-full py-2.5 rounded-xl text-sm font-semibold mt-2 transition-all"
                style={{ background: "#1A5C2A", color: "#ffffff" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "#2E7D40")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "#1A5C2A")
                }
              >
                Apply for Building Permit
              </button>
            </div>
          ),
        },
        {
          title: "Community Tax Certificate",
          content: "How to get your Cedula (Community Tax Certificate).",
          fullContent: (
            <div className="space-y-4">
              <p className="text-sm" style={{ color: "#2E7D40" }}>
                The Community Tax Certificate (Cedula) is a basic tax document
                required for various transactions in the Philippines.
              </p>
              <div className="space-y-3">
                <div>
                  <h4
                    className="font-semibold text-sm mb-2"
                    style={{ color: "#1A5C2A" }}
                  >
                    Who Needs a Cedula?
                  </h4>
                  <ul
                    className="list-disc list-inside text-sm space-y-1"
                    style={{ color: "#2E7D40" }}
                  >
                    <li>All Filipino citizens 18 years old and above</li>
                    <li>Individuals engaging in business or profession</li>
                    <li>Anyone requiring it for government transactions</li>
                  </ul>
                </div>
                <div>
                  <h4
                    className="font-semibold text-sm mb-2"
                    style={{ color: "#1A5C2A" }}
                  >
                    Requirements
                  </h4>
                  <ul
                    className="list-disc list-inside text-sm space-y-1"
                    style={{ color: "#2E7D40" }}
                  >
                    <li>Valid government-issued ID</li>
                    <li>Proof of income (for employed individuals)</li>
                    <li>
                      Proof of business registration (for business owners)
                    </li>
                    <li>Proof of residency in Verdant Acres</li>
                  </ul>
                </div>
                <div>
                  <h4
                    className="font-semibold text-sm mb-1"
                    style={{ color: "#1A5C2A" }}
                  >
                    Tax Rates
                  </h4>
                  <p className="text-sm" style={{ color: "#2E7D40" }}>
                    Basic Community Tax: ₱5.00
                    <br />
                    Additional tax based on income/property value
                    <br />
                    Maximum amount: ₱5,000.00
                  </p>
                </div>
                <div>
                  <h4
                    className="font-semibold text-sm mb-1"
                    style={{ color: "#1A5C2A" }}
                  >
                    Validity
                  </h4>
                  <p className="text-sm" style={{ color: "#2E7D40" }}>
                    Valid for one calendar year (January 1 to December 31). Must
                    be renewed annually.
                  </p>
                </div>
              </div>
              <button
                className="w-full py-2.5 rounded-xl text-sm font-semibold mt-2 transition-all"
                style={{ background: "#1A5C2A", color: "#ffffff" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "#2E7D40")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "#1A5C2A")
                }
              >
                Apply for Cedula
              </button>
            </div>
          ),
        },
      ],
    },
    {
      category: "Emergency Procedures",
      items: [
        {
          title: "Emergency Hotlines",
          content:
            "Important contact numbers for police, fire, and medical emergencies.",
          fullContent: (
            <div className="space-y-4">
              <p className="text-sm" style={{ color: "#2E7D40" }}>
                Keep these emergency numbers handy. Stay calm and provide clear
                information about your location and situation.
              </p>
              <div className="space-y-3">
                <div
                  className="rounded-lg p-4"
                  style={{ background: "#FEE2E2", border: "1px solid #fecaca" }}
                >
                  <h4
                    className="font-semibold mb-1"
                    style={{ color: "#dc2626" }}
                  >
                    National Emergency Hotline
                  </h4>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#7f1d1d" }}
                  >
                    911
                  </p>
                  <p className="text-sm mt-1" style={{ color: "#dc2626" }}>
                    For all types of emergencies
                  </p>
                </div>
                {[
                  {
                    label: "Las Piñas City Police Station",
                    number: "(043) 288-2222",
                    desc: "Available 24/7",
                  },
                  {
                    label: "Las Piñas City Fire Station",
                    number: "(043) 288-3333",
                    desc: "Fire emergencies and rescue operations",
                  },
                  {
                    label: "Las Piñas City Hospital",
                    number: "(043) 288-4444",
                    desc: "Medical emergencies and ambulance services",
                  },
                  {
                    label: "Disaster Risk Reduction Office",
                    number: "(043) 288-5555",
                    desc: "Natural disasters and evacuation assistance",
                  },
                  {
                    label: "Red Cross Las Piñas City",
                    number: "(043) 288-6666",
                    desc: "Emergency medical services and blood bank",
                  },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-3"
                    style={{
                      background: "#F0F7F1",
                      border: "1px solid #C8E6C9",
                    }}
                  >
                    <h4
                      className="font-semibold text-sm mb-1"
                      style={{ color: "#1A5C2A" }}
                    >
                      {c.label}
                    </h4>
                    <p
                      className="text-lg font-bold"
                      style={{ color: "#0F3A1A" }}
                    >
                      {c.number}
                    </p>
                    <p className="text-xs" style={{ color: "#2E7D40" }}>
                      {c.desc}
                    </p>
                  </div>
                ))}
              </div>
              <div
                className="rounded-lg p-3"
                style={{ background: "#E8F5E9", border: "1px solid #C8E6C9" }}
              >
                <p className="text-sm" style={{ color: "#0F3A1A" }}>
                  <strong>Tip:</strong> Save these numbers in your phone
                  contacts for quick access during emergencies.
                </p>
              </div>
            </div>
          ),
        },
        {
          title: "Disaster Preparedness",
          content: "What to do before, during, and after natural disasters.",
          fullContent: (
            <div className="space-y-4">
              <p className="text-sm" style={{ color: "#2E7D40" }}>
                Being prepared can save lives. Know what to do before, during,
                and after a disaster.
              </p>
              {[
                {
                  label: "Before a Disaster",
                  items: [
                    "Prepare an emergency kit (food, water, first aid, flashlight, radio, batteries)",
                    "Know your evacuation routes and nearest evacuation center",
                    "Keep important documents in waterproof containers",
                    "Charge all electronic devices and power banks",
                    "Store enough food and water for at least 3 days",
                    "Secure loose objects that could become projectiles",
                  ],
                },
                {
                  label: "During a Typhoon/Flood",
                  items: [
                    "Stay indoors and away from windows",
                    "Monitor weather updates via radio or mobile phone",
                    "Evacuate immediately if ordered by authorities",
                    "Never walk or drive through flooded areas",
                    "Turn off electricity and gas if flooding is imminent",
                    "Move to higher ground if water starts rising",
                  ],
                },
                {
                  label: "During an Earthquake",
                  items: [
                    "DROP, COVER, and HOLD ON",
                    "Stay away from windows, mirrors, and heavy objects",
                    "If outdoors, move to an open area away from buildings",
                    "If in a vehicle, stop safely and stay inside",
                    "Do not use elevators",
                    "Be prepared for aftershocks",
                  ],
                },
                {
                  label: "After a Disaster",
                  items: [
                    "Check yourself and others for injuries",
                    "Inspect your home for damage before entering",
                    "Avoid damaged buildings and power lines",
                    "Boil water before drinking if water supply is compromised",
                    "Document damage for insurance claims",
                    "Follow instructions from local authorities",
                  ],
                },
              ].map((section, i) => (
                <div key={i}>
                  <h4
                    className="font-semibold text-sm mb-2"
                    style={{ color: "#1A5C2A" }}
                  >
                    {section.label}
                  </h4>
                  <ul
                    className="list-disc list-inside text-sm space-y-1"
                    style={{ color: "#2E7D40" }}
                  >
                    {section.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ),
        },
      ],
    },
  ];

  return (
    <CitizenLayout>
      <div
        className="flex flex-col min-h-screen"
        style={{ background: "linear-gradient(to bottom, #F0F7F1, #ffffff)" }}
      >
        {/* Header */}
        <header
          className="px-4 py-4 border-b sticky top-0 z-10"
          style={{
            background:
              "linear-gradient(135deg, #0F3A1A 0%, #1A5C2A 50%, #2E7D40 100%)",
            borderColor: "rgba(200,230,201,0.2)",
          }}
        >
          <div className="flex items-center gap-3">
            <Link href="/dashboard/citizen">
              <button
                className="p-1.5 rounded-lg transition-colors"
                style={{ background: "rgba(255,255,255,0.1)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.2)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.1)")
                }
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            </Link>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" style={{ color: "#4CAF6B" }} />
              <h1 className="text-lg font-bold text-white">Resident Guide</h1>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 px-4 py-6 pb-24 overflow-y-auto">
          {/* Welcome Card */}
          <div
            className="rounded-2xl p-4 mb-6"
            style={{ background: "#ffffff", border: "1px solid #C8E6C9" }}
          >
            <h2 className="font-bold mb-1" style={{ color: "#0F3A1A" }}>
              Welcome to Verdant Acres!
            </h2>
            <p className="text-sm" style={{ color: "#2E7D40" }}>
              This guide will help you navigate village services, understand
              procedures, and access important information.
            </p>
          </div>

          {/* Guide Sections */}
          {guides.map((guide, idx) => (
            <div key={idx} className="mb-6">
              <h2
                className="text-base font-bold mb-3"
                style={{ color: "#0F3A1A" }}
              >
                {guide.category}
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {guide.items.map((item, itemIdx) => {
                  const itemKey = `item-${idx}-${itemIdx}`;
                  const isExpanded = expandedItems[itemKey];
                  return (
                    <AccordionItem
                      key={itemIdx}
                      value={itemKey}
                      className="rounded-xl overflow-hidden"
                      style={{
                        background: "#ffffff",
                        border: "1px solid #C8E6C9",
                      }}
                    >
                      <AccordionTrigger
                        className="px-4 hover:no-underline rounded-t-xl"
                        style={{ color: "#0F3A1A" }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.background =
                            "#F0F7F1")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLElement).style.background =
                            "transparent")
                        }
                      >
                        <span className="font-semibold text-sm text-left">
                          {item.title}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-1">
                        {!isExpanded ? (
                          <>
                            <p className="text-sm" style={{ color: "#2E7D40" }}>
                              {item.content}
                            </p>
                            <button
                              className="flex items-center gap-1 text-sm font-medium mt-2 transition-colors"
                              style={{ color: "#1A5C2A" }}
                              onClick={() => toggleExpanded(itemKey)}
                              onMouseEnter={(e) =>
                                ((e.currentTarget as HTMLElement).style.color =
                                  "#4CAF6B")
                              }
                              onMouseLeave={(e) =>
                                ((e.currentTarget as HTMLElement).style.color =
                                  "#1A5C2A")
                              }
                            >
                              Read more <ChevronRight className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            {item.fullContent}
                            <button
                              className="flex items-center gap-1 text-sm font-medium mt-3 transition-colors"
                              style={{ color: "#1A5C2A" }}
                              onClick={() => toggleExpanded(itemKey)}
                              onMouseEnter={(e) =>
                                ((e.currentTarget as HTMLElement).style.color =
                                  "#4CAF6B")
                              }
                              onMouseLeave={(e) =>
                                ((e.currentTarget as HTMLElement).style.color =
                                  "#1A5C2A")
                              }
                            >
                              Show less
                            </button>
                          </>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          ))}
        </main>
      </div>
    </CitizenLayout>
  );
}

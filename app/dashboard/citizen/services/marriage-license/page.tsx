"use client"

import { useState } from "react"
import { ArrowLeft, Heart, FileText, CheckCircle2, MapPin, Clock, AlertCircle, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CitizenLayout from "@/components/citizenLayout"

const steps = [
  { 
    id: 1, 
    name: "Requirements", 
    icon: FileText,
    description: "Documents needed for application"
  },
  { 
    id: 2, 
    name: "Application Process", 
    icon: Heart,
    description: "Step-by-step application guide"
  },
  { 
    id: 3, 
    name: "Important Information", 
    icon: AlertCircle,
    description: "Fees, validity, and notes"
  },
]

export default function MarriageLicenseGuidePage() {
  const [currentStep, setCurrentStep] = useState(1)

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <CitizenLayout>
      <div className="min-h-screen bg-[#0f241a] pb-20 lg:pb-0">
        <div className="bg-[#1a3a2e] border-b border-[#2d5a45] sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="hover:bg-[#2d5a45]">
              <ArrowLeft className="h-5 w-5 text-[#d4a574]" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-[#d4a574]">Marriage License Guide</h1>
              <p className="text-sm text-gray-300">
                How to get a marriage license in the Philippines
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 lg:p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep >= step.id ? "bg-[#d4a574] text-[#1a3a2e]" : "bg-[#2d5a45] text-gray-400"
                      }`}
                    >
                      {currentStep > step.id ? <CheckCircle2 className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                    </div>
                    <span className="text-xs mt-2 text-center hidden sm:block text-gray-300">{step.name}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 ${currentStep > step.id ? "bg-[#d4a574]" : "bg-[#2d5a45]"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-[#1a3a2e] border-[#2d5a45]">
            <CardHeader>
              <CardTitle className="text-[#d4a574]">{steps[currentStep - 1].name}</CardTitle>
              <CardDescription className="text-gray-300">{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-200">Required Documents (for both parties)</h3>
                    
                    <div className="space-y-3">
                      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-blue-300">1. Certified True Copy of Birth Certificate (PSA)</h4>
                        <p className="text-sm text-gray-300">Original copy issued by the Philippine Statistics Authority</p>
                      </div>

                      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-blue-300">2. Valid Government-Issued ID</h4>
                        <p className="text-sm text-gray-300">Examples: Passport, Driver's License, UMID, Postal ID, Voter's ID</p>
                      </div>

                      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-blue-300">3. Certificate of No Marriage (CENOMAR)</h4>
                        <p className="text-sm text-gray-300">Also from PSA, proves you are single or not currently married</p>
                      </div>

                      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-blue-300">4. Barangay Certificate of Residency</h4>
                        <p className="text-sm text-gray-300">Proof of residence for at least one month in the city/municipality</p>
                      </div>

                      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-blue-300">5. Passport-sized Photos</h4>
                        <p className="text-sm text-gray-300">2 copies each (4 total) - recent colored photos with white background</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-200">Additional Requirements (if applicable)</h3>
                    
                    <div className="space-y-3">
                      <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-yellow-300">For Widows/Widowers:</h4>
                        <p className="text-sm text-gray-300">Death Certificate of deceased spouse</p>
                      </div>

                      <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-yellow-300">For Divorced/Annulled:</h4>
                        <p className="text-sm text-gray-300">Court decree of divorce or annulment</p>
                      </div>

                      <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-yellow-300">For Minors (18-21 years old):</h4>
                        <p className="text-sm text-gray-300">Parental consent and parental advice certificate</p>
                      </div>

                      <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2 text-yellow-300">For Foreign Nationals:</h4>
                        <p className="text-sm text-gray-300">Passport, Certificate of Legal Capacity to Contract Marriage from embassy</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-[#2d5a45] border border-[#3d6a55] rounded-lg p-4">
                    <div className="flex gap-2">
                      <MapPin className="h-5 w-5 text-[#d4a574] flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-[#d4a574]">Where to Apply</h4>
                        <p className="text-sm text-gray-300 mt-1">
                          Local Civil Registrar's Office of the city or municipality where either party has resided for at least one month
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-200">Step-by-Step Process</h3>
                    
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#d4a574] text-[#1a3a2e] rounded-full flex items-center justify-center font-semibold">
                          1
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-200">Prepare all required documents</h4>
                          <p className="text-sm text-gray-300 mt-1">Gather all documents listed in the requirements section. Make sure all are original copies.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#d4a574] text-[#1a3a2e] rounded-full flex items-center justify-center font-semibold">
                          2
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-200">Visit the Local Civil Registrar's Office</h4>
                          <p className="text-sm text-gray-300 mt-1">Both parties must appear together. Go to the office during business hours (usually 8am-5pm, Monday-Friday).</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#d4a574] text-[#1a3a2e] rounded-full flex items-center justify-center font-semibold">
                          3
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-200">Fill out the Marriage License Application Form</h4>
                          <p className="text-sm text-gray-300 mt-1">Staff will provide the form. Fill it out completely and accurately.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#d4a574] text-[#1a3a2e] rounded-full flex items-center justify-center font-semibold">
                          4
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-200">Submit documents and pay the fee</h4>
                          <p className="text-sm text-gray-300 mt-1">Submit all required documents along with the application fee.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#d4a574] text-[#1a3a2e] rounded-full flex items-center justify-center font-semibold">
                          5
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-200">Attend the marriage counseling seminar</h4>
                          <p className="text-sm text-gray-300 mt-1">Required by law. Usually conducted by the Local Civil Registrar or authorized personnel.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#d4a574] text-[#1a3a2e] rounded-full flex items-center justify-center font-semibold">
                          6
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-200">Marriage license posting</h4>
                          <p className="text-sm text-gray-300 mt-1">Your application will be posted publicly for 10 consecutive days to allow objections.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#d4a574] text-[#1a3a2e] rounded-full flex items-center justify-center font-semibold">
                          7
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-200">Claim your marriage license</h4>
                          <p className="text-sm text-gray-300 mt-1">After the 10-day posting period, you can claim your marriage license.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
                      <div className="flex gap-2">
                        <DollarSign className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-300">Application Fee</h4>
                          <p className="text-sm text-gray-300 mt-1">
                            Fees vary by city/municipality, typically ranging from ₱200 to ₱500. Check with your local Civil Registrar's Office for exact amount.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
                      <div className="flex gap-2">
                        <Clock className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-300">Processing Time</h4>
                          <p className="text-sm text-gray-300 mt-1">
                            Minimum of 10 days due to the posting requirement. Total processing may take 2-3 weeks.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4">
                      <div className="flex gap-2">
                        <AlertCircle className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-purple-300">Validity Period</h4>
                          <p className="text-sm text-gray-300 mt-1">
                            Marriage license is valid for 120 days from date of issuance. You must get married within this period.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-200">Important Reminders</h3>
                    
                    <div className="space-y-3">
                      <div className="bg-[#2d5a45] border border-[#3d6a55] rounded-lg p-4">
                        <p className="text-sm text-gray-300">
                          ✓ Both parties must be <strong className="text-[#d4a574]">at least 18 years old</strong>. Those aged 18-21 need parental consent.
                        </p>
                      </div>

                      <div className="bg-[#2d5a45] border border-[#3d6a55] rounded-lg p-4">
                        <p className="text-sm text-gray-300">
                          ✓ Both parties must <strong className="text-[#d4a574]">appear in person together</strong> when applying.
                        </p>
                      </div>

                      <div className="bg-[#2d5a45] border border-[#3d6a55] rounded-lg p-4">
                        <p className="text-sm text-gray-300">
                          ✓ The marriage ceremony can be held <strong className="text-[#d4a574]">anywhere in the Philippines</strong> once you have the license.
                        </p>
                      </div>

                      <div className="bg-[#2d5a45] border border-[#3d6a55] rounded-lg p-4">
                        <p className="text-sm text-gray-300">
                          ✓ You must have <strong className="text-[#d4a574]">two witnesses</strong> (of legal age) present during the marriage ceremony.
                        </p>
                      </div>

                      <div className="bg-[#2d5a45] border border-[#3d6a55] rounded-lg p-4">
                        <p className="text-sm text-gray-300">
                          ✓ After the ceremony, your solemnizing officer will register the marriage with the Local Civil Registrar.
                        </p>
                      </div>

                      <div className="bg-[#2d5a45] border border-[#3d6a55] rounded-lg p-4">
                        <p className="text-sm text-gray-300">
                          ✓ You can request a <strong className="text-[#d4a574]">Marriage Certificate</strong> from PSA after registration (usually available after a few months).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
                    <h4 className="font-medium text-red-300 mb-2">Grounds for Denial</h4>
                    <p className="text-sm text-gray-300">
                      Your application may be denied if either party is already married, below legal age without consent, or if there are valid legal impediments to marriage.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handleBack} className="flex-1 border-[#2d5a45] text-gray-300 hover:bg-[#2d5a45]">
                    Back
                  </Button>
                )}
                {currentStep < steps.length ? (
                  <Button onClick={handleNext} className="flex-1 bg-[#d4a574] hover:bg-[#c49564] text-[#1a3a2e]">
                    Next
                  </Button>
                ) : (
                  <Button onClick={() => setCurrentStep(1)} className="flex-1 bg-[#d4a574] hover:bg-[#c49564] text-[#1a3a2e]">
                    Back to Start
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CitizenLayout>
  )
}

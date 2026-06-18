"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CitizenLayout from "@/components/citizenLayout"
import { authClient } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

export default function CedulaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    civilStatus: "",
    citizenship: "Filipino",
    occupation: "",
    tinNumber: "",
    height: "",
    heightUnit: "cm",
    weight: "",
    weightUnit: "kg",
  })

  // Auto-fill form with logged-in user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await authClient.getCurrentUser()
        if (user) {
          setFormData((prev) => ({
            ...prev,
            fullName: user.name || "",
            email: user.email || "",
            phone: user.phone_number || "",
            address: user.address || "",
            birthDate: user.birth_date || "",
            civilStatus: user.civil_status || "",
            citizenship: user.citizenship || "Filipino",
            occupation: user.occupation || "",
            tinNumber: user.tin_number || "",
            height: user.height || "",
            heightUnit: user.height_unit || "cm",
            weight: user.weight || "",
            weightUnit: user.weight_unit || "kg",
          }))

          toast({
            title: "Welcome Back",
            description: "Your profile information has been pre-filled.",
          })
        } else {
          toast({
            title: "Authentication Required",
            description: "Please log in to continue.",
            variant: "destructive",
          })
          router.push("/login")
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        toast({
          title: "Error",
          description: "Failed to load your profile information.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [toast, router])

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    // Validate required fields
    if (!formData.fullName.trim()) {
      toast({
        title: "Validation Error",
        description: "Full name is required",
        variant: "destructive",
      })
      return false
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Valid email is required",
        variant: "destructive",
      })
      return false
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Validation Error",
        description: "Phone number is required",
        variant: "destructive",
      })
      return false
    }

    if (!formData.address.trim()) {
      toast({
        title: "Validation Error",
        description: "Complete address is required",
        variant: "destructive",
      })
      return false
    }

    if (!formData.birthDate) {
      toast({
        title: "Validation Error",
        description: "Birth date is required",
        variant: "destructive",
      })
      return false
    }

    // Validate birth date is not in the future
    const birthDate = new Date(formData.birthDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (birthDate > today) {
      toast({
        title: "Validation Error",
        description: "Birth date cannot be in the future",
        variant: "destructive",
      })
      return false
    }

    // Validate minimum age (18 years old)
    const minDate = new Date()
    minDate.setFullYear(minDate.getFullYear() - 18)
    if (birthDate > minDate) {
      toast({
        title: "Age Requirement Not Met",
        description: "Applicant must be at least 18 years old",
        variant: "destructive",
      })
      return false
    }

    if (!formData.civilStatus) {
      toast({
        title: "Validation Error",
        description: "Civil status is required",
        variant: "destructive",
      })
      return false
    }

    if (!formData.citizenship.trim()) {
      toast({
        title: "Validation Error",
        description: "Citizenship is required",
        variant: "destructive",
      })
      return false
    }

    if (!formData.occupation.trim()) {
      toast({
        title: "Validation Error",
        description: "Occupation is required",
        variant: "destructive",
      })
      return false
    }

    if (!formData.height || Number.parseFloat(formData.height) <= 0 || Number.parseFloat(formData.height) > 999.99) {
      toast({
        title: "Validation Error",
        description: "Valid height is required (max 999.99)",
        variant: "destructive",
      })
      return false
    }

    if (!formData.weight || Number.parseFloat(formData.weight) <= 0 || Number.parseFloat(formData.weight) > 999.99) {
      toast({
        title: "Validation Error",
        description: "Valid weight is required (max 999.99)",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/cedula", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          birth_date: formData.birthDate,
          civil_status: formData.civilStatus,
          citizenship: formData.citizenship,
          occupation: formData.occupation,
          tin_number: formData.tinNumber,
          height: formData.height,
          height_unit: formData.heightUnit,
          weight: formData.weight,
          weight_unit: formData.weightUnit,
        }),
      })

      const data = await response.json()

      if (response.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        })
        setTimeout(() => {
          router.push("/login")
        }, 2000)
        return
      }

      if (response.ok && data.success) {
        toast({
          title: "Success!",
          description: "Your cedula application has been submitted successfully.",
        })
        setTimeout(() => {
          router.push("/dashboard/citizen/account/applications?success=cedula")
        }, 1500)
      } else {
        toast({
          title: "Application Failed",
          description: data.message || "Failed to submit application. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      const errorMsg =
        error instanceof TypeError && error.message.includes("Failed to fetch")
          ? "Network connection error. Please check your internet connection."
          : "An unexpected error occurred. Please try again."

      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <CitizenLayout>
        <div className="min-h-screen bg-[#e8f5e9] pb-20 lg:pb-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#2e7d32]" />
            <p className="text-sm text-gray-600">Loading your information...</p>
          </div>
        </div>
      </CitizenLayout>
    )
  }

  return (
    <CitizenLayout>
      <div className="min-h-screen bg-[#e8f5e9] pb-20 lg:pb-0">
        <div className="bg-white border-b border-[#c8e6c9] sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-[#e8f5e9]">
              <ArrowLeft className="h-5 w-5 text-[#2e7d32]" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center">
                <FileText className="h-5 w-5 text-[#2e7d32]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1b5e20]">Community Tax Certificate (Cedula)</h1>
                <p className="text-sm text-gray-600">Apply for your cedula</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 lg:p-6">
          {/* Info Banner */}
          <div className="mb-6 p-4 bg-[#e3f2fd] border border-[#90caf9] rounded-lg">
            <p className="text-sm text-[#1565c0]">
              ℹ️ Your personal information has been pre-filled from your account. You can edit any field if needed.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="bg-white border-[#c8e6c9]">
              <CardHeader>
                <CardTitle className="text-[#1b5e20]">Personal Information</CardTitle>
                <CardDescription className="text-gray-600">
                  Fill in your details to apply for a community tax certificate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => updateFormData("fullName", e.target.value)}
                      required
                      className="border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        required
                        className="border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700">
                        Contact Number *
                      </Label>
                      <Input
                        id="phone"
                        placeholder="09XX XXX XXXX"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        required
                        className="border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-700">
                      Complete Address *
                    </Label>
                    <Input
                      id="address"
                      placeholder="Street, Barangay, City"
                      value={formData.address}
                      onChange={(e) => updateFormData("address", e.target.value)}
                      required
                      className="border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="text-gray-700">
                        Date of Birth *
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => updateFormData("birthDate", e.target.value)}
                        max={new Date().toISOString().split("T")[0]}
                        required
                        className="border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]"
                      />
                      <p className="text-xs text-gray-500">Must be at least 18 years old</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="civilStatus" className="text-gray-700">
                        Civil Status *
                      </Label>
                      <Select
                        value={formData.civilStatus}
                        onValueChange={(value) => updateFormData("civilStatus", value)}
                        required
                      >
                        <SelectTrigger className="border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                          <SelectItem value="separated">Separated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="citizenship" className="text-gray-700">
                        Citizenship *
                      </Label>
                      <Input
                        id="citizenship"
                        placeholder="Filipino"
                        value={formData.citizenship}
                        onChange={(e) => updateFormData("citizenship", e.target.value)}
                        required
                        className="border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="occupation" className="text-gray-700">
                        Occupation *
                      </Label>
                      <Input
                        id="occupation"
                        placeholder="Enter your occupation"
                        value={formData.occupation}
                        onChange={(e) => updateFormData("occupation", e.target.value)}
                        required
                        className="border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tinNumber" className="text-gray-700">
                        TIN Number
                      </Label>
                      <Input
                        id="tinNumber"
                        placeholder="XXX-XXX-XXX-XXX"
                        value={formData.tinNumber}
                        onChange={(e) => updateFormData("tinNumber", e.target.value)}
                        className="border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height" className="text-gray-700">
                        Height *
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="height"
                          type="number"
                          step="0.01"
                          placeholder="170.5"
                          value={formData.height}
                          onChange={(e) => updateFormData("height", e.target.value)}
                          className="flex-1 border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]"
                          required
                        />
                        <Select
                          value={formData.heightUnit}
                          onValueChange={(value) => updateFormData("heightUnit", value)}
                        >
                          <SelectTrigger className="w-20 border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cm">cm</SelectItem>
                            <SelectItem value="in">in</SelectItem>
                            <SelectItem value="ft">ft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-gray-700">
                        Weight *
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="weight"
                          type="number"
                          step="0.01"
                          placeholder="65.5"
                          value={formData.weight}
                          onChange={(e) => updateFormData("weight", e.target.value)}
                          className="flex-1 border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]"
                          required
                        />
                        <Select
                          value={formData.weightUnit}
                          onValueChange={(value) => updateFormData("weightUnit", value)}
                        >
                          <SelectTrigger className="w-20 border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="lbs">lbs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#e8f5e9] border border-[#c8e6c9] rounded-lg p-4">
                  <p className="text-sm text-[#2e7d32]">
                    <strong>Note:</strong> Processing time is 3-5 business days. You will receive an email notification
                    once your cedula is ready for pickup.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2e7d32] hover:bg-[#1b5e20] text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </CitizenLayout>
  )
}

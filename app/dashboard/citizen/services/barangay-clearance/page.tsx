"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, FileText, User, Home, AlertCircle } from 'lucide-react'
import CitizenLayout from "@/components/citizenLayout"
import { authClient } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

export default function BarangayClearancePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    age: "",
    sex: "",
    civilStatus: "",
    yearsOfResidency: "",
    barangay: "",
    purpose: "",
    validId: null as File | null,
  })

  // Auto-fill form with logged-in user data using authClient
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await authClient.getCurrentUser()
        if (user) {
          // Calculate age from birth_date if available
          let calculatedAge = ""
          if (user.birth_date) {
            const birthDate = new Date(user.birth_date)
            const today = new Date()
            let age = today.getFullYear() - birthDate.getFullYear()
            const monthDiff = today.getMonth() - birthDate.getMonth()
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--
            }
            calculatedAge = age.toString()
          }

          // Extract barangay from address if possible
          let barangayValue = ""
          if (user.address) {
            const addressParts = user.address.split(",")
            if (addressParts.length >= 2) {
              barangayValue = addressParts[addressParts.length - 3]?.trim() || ""
            }
          }

          setFormData(prev => ({
            ...prev,
            fullName: user.name || "",
            email: user.email || "",
            phone: user.phone_number || "",
            address: user.address || "",
            birthDate: user.birth_date || "",
            age: calculatedAge,
            sex: user.sex || "",
            civilStatus: user.civil_status || "",
            barangay: barangayValue,
          }))

          toast({
            title: "Welcome Back",
            description: "Your profile information has been pre-filled.",
          })
        } else {
          // User not authenticated, redirect to login
          toast({
            title: "Authentication Required",
            description: "Please log in to continue.",
            variant: "destructive",
          })
          router.push('/login')
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

  const handleInputChange = (field: string, value: string) => {
    // Auto-calculate age when birth date changes
    if (field === "birthDate" && value) {
      const birthDate = new Date(value)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      setFormData((prev) => ({ ...prev, [field]: value, age: age.toString() }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
    setErrorMessage("")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File size must be less than 10MB")
        e.target.value = ""
        return
      }

      // Validate file type
      const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]
      if (!validTypes.includes(file.type)) {
        setErrorMessage("Please upload a PDF, JPG, or PNG file")
        e.target.value = ""
        return
      }

      setFormData((prev) => ({ ...prev, validId: file }))
      setErrorMessage("")
    }
  }

  const validateStep = () => {
    setErrorMessage("")

    if (currentStep === 1) {
      if (!formData.fullName.trim()) {
        setErrorMessage("Full name is required")
        return false
      }
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        setErrorMessage("Valid email is required")
        return false
      }
      if (!formData.phone.trim()) {
        setErrorMessage("Phone number is required")
        return false
      }
      if (!formData.birthDate) {
        setErrorMessage("Birth date is required")
        return false
      }

      // Validate birth date is not in the future
      const birthDate = new Date(formData.birthDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset time to compare dates only
      if (birthDate > today) {
        setErrorMessage("Birth date cannot be in the future")
        return false
      }

      // Validate minimum age (must be at least 18 years old - legal voting age in PH)
      const minDate = new Date()
      minDate.setFullYear(minDate.getFullYear() - 18)
      if (birthDate > minDate) {
        setErrorMessage("Applicant must be at least 18 years old (legal voting age in the Philippines)")
        return false
      }

      if (!formData.age || parseInt(formData.age) < 18) {
        setErrorMessage("Applicant must be at least 18 years old")
        return false
      }

      // Validate age matches birth date
      const calculatedAge = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      const inputAge = parseInt(formData.age)
      if (Math.abs(calculatedAge - inputAge) > 1) {
        setErrorMessage("Age does not match birth date. Please check your entries.")
        return false
      }

      if (!formData.sex) {
        setErrorMessage("Sex is required")
        return false
      }
      if (!formData.civilStatus) {
        setErrorMessage("Civil status is required")
        return false
      }
      if (!formData.address.trim()) {
        setErrorMessage("Complete address is required")
        return false
      }
    }

    if (currentStep === 2) {
      if (!formData.barangay.trim()) {
        setErrorMessage("Barangay is required")
        return false
      }
      if (!formData.yearsOfResidency || parseInt(formData.yearsOfResidency) < 0) {
        setErrorMessage("Years of residency is required")
        return false
      }
      if (!formData.purpose.trim()) {
        setErrorMessage("Purpose is required")
        return false
      }
    }

    if (currentStep === 3) {
      if (!formData.validId) {
        setErrorMessage("Valid ID is required")
        return false
      }
    }

    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
      toast({
        title: "Step Complete",
        description: `You're on step ${currentStep + 1} of 4`,
      })
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setErrorMessage("")
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const formDataToSend = new FormData()

      // Append all form fields
      formDataToSend.append("fullName", formData.fullName)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("phone", formData.phone)
      formDataToSend.append("address", formData.address)
      formDataToSend.append("birthDate", formData.birthDate)
      formDataToSend.append("age", formData.age)
      formDataToSend.append("sex", formData.sex)
      formDataToSend.append("civilStatus", formData.civilStatus)
      formDataToSend.append("yearsOfResidency", formData.yearsOfResidency)
      formDataToSend.append("barangay", formData.barangay)
      formDataToSend.append("purpose", formData.purpose)

      if (formData.validId) {
        formDataToSend.append("validId", formData.validId)
      }

      console.log('Submitting barangay clearance application...')
      // Cookie is automatically sent with the request
      const response = await fetch("/api/barangay-clearance", {
        method: "POST",
        credentials: "include", // Important: Include cookies
        body: formDataToSend,
      })

      const data = await response.json()
      console.log('Response received:', {
        status: response.status,
        success: data.success,
        message: data.message
      })

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
        setReferenceNumber(data.data.reference_number)
        setSubmitSuccess(true)
        toast({
          title: "Success!",
          description: "Your barangay clearance application has been submitted.",
        })
      } else {
        // Handle validation errors
        let errorMsg = data.message || "Failed to submit application"
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(", ")
          errorMsg = errorMessages
        }

        setErrorMessage(errorMsg)
        toast({
          title: "Application Failed",
          description: errorMsg,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      const errorMsg = error instanceof TypeError && error.message.includes("Failed to fetch")
        ? "Network connection error. Please check your internet connection."
        : "Unable to connect to server. Please try again."

      setErrorMessage(errorMsg)
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <CitizenLayout>
        {/* <CHANGE> Updated success screen with new green color scheme */}
        <div className="min-h-screen bg-[#e8f5e9] flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white border-[#c8e6c9]">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-[#e8f5e9] rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-[#2e7d32]" />
              </div>
              <CardTitle className="text-2xl text-[#1b5e20]">Application Submitted!</CardTitle>
              <CardDescription className="text-gray-600">Your barangay clearance application has been received</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-[#e8f5e9] p-4 rounded-lg border border-[#c8e6c9]">
                <p className="text-sm text-gray-600 mb-1">Reference Number</p>
                <p className="text-xl font-bold text-[#2e7d32]">{referenceNumber}</p>
              </div>
              <div className="bg-[#e3f2fd] p-4 rounded-lg border border-[#90caf9]">
                <p className="text-sm font-semibold text-[#1565c0] mb-2">What's Next?</p>
                <ul className="text-sm text-[#1976d2] space-y-1">
                  <li>• Your application will be reviewed by the admin</li>
                  <li>• You can track status in your dashboard</li>
                  <li>• You'll be notified when it's approved</li>
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                Please save this reference number for tracking your application status.
              </p>
              <Button onClick={() => router.push("/dashboard/citizen")} className="w-full bg-[#2e7d32] hover:bg-[#1b5e20] text-white">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </CitizenLayout>
    )
  }

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Residency Info", icon: Home },
    { number: 3, title: "Documents", icon: FileText },
    { number: 4, title: "Review", icon: CheckCircle2 },
  ]

  return (
    <CitizenLayout>
    {/* <CHANGE> Updated main container with new green color scheme */}
    <div className="min-h-screen bg-[#e8f5e9] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1b5e20] mb-2">Barangay Clearance Application</h1>
          <p className="text-gray-600">Apply for your barangay clearance certificate</p>
        </div>

        {isLoading ? (
          <Card className="bg-white border-[#c8e6c9]">
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#2e7d32] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading your information...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Info Banner */}
            <div className="mb-6 p-4 bg-[#e3f2fd] border border-[#90caf9] rounded-lg">
              <p className="text-sm text-[#1565c0]">
                ℹ️ Your personal information has been pre-filled from your account. You can edit any field if needed.
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          currentStep >= step.number ? "bg-[#2e7d32] text-white" : "bg-[#c8e6c9] text-gray-500"
                        }`}
                      >
                        <step.icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs mt-2 text-gray-600">{step.title}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-1 flex-1 mx-2 ${currentStep > step.number ? "bg-[#2e7d32]" : "bg-[#c8e6c9]"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

        <Card className="bg-white border-[#c8e6c9]">
          <CardHeader>
            <CardTitle className="text-[#1b5e20]">Step {currentStep} of 4</CardTitle>
            <CardDescription className="text-gray-600">{steps[currentStep - 1].title}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            )}

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-700">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="Juan Dela Cruz"
                      required
                      className="border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="juan@example.com"
                      required
                      className="border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="09123456789"
                      required
                      className="border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-gray-700">Birth Date *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange("birthDate", e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      required
                      className="border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]"
                    />
                    <p className="text-xs text-gray-500">Age will be calculated automatically</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-gray-700">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      placeholder="18"
                      min="18"
                      max="150"
                      required
                      disabled={!!formData.birthDate}
                      className="border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]"
                    />
                    {formData.birthDate && (
                      <p className="text-xs text-gray-500">Auto-calculated from birth date (must be 18+)</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sex" className="text-gray-700">Sex *</Label>
                    <Select value={formData.sex} onValueChange={(value) => handleInputChange("sex", value)}>
                      <SelectTrigger className="border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]">
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="civilStatus" className="text-gray-700">Civil Status *</Label>
                    <Select
                      value={formData.civilStatus}
                      onValueChange={(value) => handleInputChange("civilStatus", value)}
                    >
                      <SelectTrigger className="border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="separated">Separated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-700">Complete Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="House No., Street, Barangay, City, Province"
                    rows={3}
                    required
                    className="border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Residency Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="barangay" className="text-gray-700">Barangay *</Label>
                    <Input
                      id="barangay"
                      value={formData.barangay}
                      onChange={(e) => handleInputChange("barangay", e.target.value)}
                      placeholder="Barangay name"
                      required
                      className="border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfResidency" className="text-gray-700">Years of Residency *</Label>
                    <Input
                      id="yearsOfResidency"
                      type="number"
                      value={formData.yearsOfResidency}
                      onChange={(e) => handleInputChange("yearsOfResidency", e.target.value)}
                      placeholder="5"
                      required
                      className="border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose" className="text-gray-700">Purpose of Clearance *</Label>
                  <Textarea
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) => handleInputChange("purpose", e.target.value)}
                    placeholder="e.g., Employment, Business Permit, School Requirements, etc."
                    rows={4}
                    required
                    className="border-[#c8e6c9] focus:border-[#2e7d32] focus:ring-[#2e7d32]"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Documents */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="validId" className="text-gray-700">Valid ID *</Label>
                  <Input id="validId" type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required className="border-[#c8e6c9]" />
                  <p className="text-sm text-gray-500">Upload a copy of your valid ID (PDF, JPG, PNG - Max 10MB)</p>
                  {formData.validId && (
                    <div className="flex items-center gap-2 p-2 bg-[#e8f5e9] border border-[#c8e6c9] rounded">
                      <CheckCircle2 className="w-4 h-4 text-[#2e7d32]" />
                      <p className="text-sm text-[#2e7d32]">File selected: {formData.validId.name}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-[#1b5e20]">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Full Name:</span>
                      <p className="font-medium text-gray-800">{formData.fullName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium text-gray-800">{formData.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p className="font-medium text-gray-800">{formData.phone}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Birth Date:</span>
                      <p className="font-medium text-gray-800">{formData.birthDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Age:</span>
                      <p className="font-medium text-gray-800">{formData.age}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Sex:</span>
                      <p className="font-medium capitalize text-gray-800">{formData.sex}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Civil Status:</span>
                      <p className="font-medium capitalize text-gray-800">{formData.civilStatus}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Address:</span>
                      <p className="font-medium text-gray-800">{formData.address}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 text-[#1b5e20]">Residency Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Barangay:</span>
                      <p className="font-medium text-gray-800">{formData.barangay}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Years of Residency:</span>
                      <p className="font-medium text-gray-800">{formData.yearsOfResidency} years</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Purpose:</span>
                      <p className="font-medium text-gray-800">{formData.purpose}</p>
                    </div>
                  </div>
                </div>

                {formData.validId && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-[#1b5e20]">Documents</h3>
                    <p className="text-sm text-gray-800">Valid ID: {formData.validId.name}</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 1} className="border-[#c8e6c9] text-gray-600 hover:bg-[#e8f5e9]">
                Previous
              </Button>
              {currentStep < 4 ? (
                <Button type="button" onClick={handleNext} className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white">
                  Next
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
          </>
        )}
      </div>
    </div>
    </CitizenLayout>
  )
}

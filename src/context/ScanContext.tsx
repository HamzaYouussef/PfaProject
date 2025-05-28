"use client"

import type React from "react"
import { createContext, useState, useContext } from "react"
import type { ScanResult, DashboardStats } from "../types"
import { useAuth } from "./AuthContext"

const OCR_API_URL = import.meta.env.VITE_OCR_API_URL

const mockScanResults: ScanResult[] = [
  {
    id: "1",
    userId: "1",
    imageUrl: "https://images.pexels.com/photos/8985458/pexels-photo-8985458.jpeg",
    extractedText: `Meeting Notes - Product Roadmap Discussion
Date: May 15, 2024
Attendees: Sarah Johnson, Mike Chen, Alex Rodriguez

Key Points:
• Q3 feature releases scheduled for July
• Mobile app optimization priority
• User feedback integration needed
• Budget allocation for new tools
• Timeline review next Friday

Action Items:
- Sarah: Finalize wireframes by May 20
- Mike: Research competitor analysis
- Alex: Update project timeline

Next Meeting: May 22, 2024 at 2:00 PM`,
    confidence: 0.92,
    createdAt: "2024-05-15T14:23:10Z",
  },
  {
    id: "2",
    userId: "1",
    imageUrl: "https://images.pexels.com/photos/6683072/pexels-photo-6683072.jpeg",
    extractedText: `Shopping List
□ Milk (2 gallons)
□ Bread (whole wheat)
□ Eggs (dozen)
□ Chicken breast (2 lbs)
□ Broccoli
□ Apples (bag)
□ Yogurt (Greek, vanilla)
□ Pasta sauce
□ Olive oil
□ Bananas

Don't forget: Pick up dry cleaning!
Call mom after grocery shopping.`,
    confidence: 0.85,
    createdAt: "2024-05-14T09:45:22Z",
  },
  {
    id: "3",
    userId: "1",
    imageUrl: "https://images.pexels.com/photos/5238117/pexels-photo-5238117.jpeg",
    extractedText: `URGENT: Project Deadline Extension Request

To: John Martinez, Project Manager
From: Development Team
Date: May 10, 2024

Subject: Request for 2-week extension on Alpha release

Dear John,

Due to unexpected technical challenges with the authentication system and additional security requirements, we need to request a 2-week extension for the Alpha release.

Current status:
- Backend API: 85% complete
- Frontend UI: 90% complete  
- Security audit: Pending
- Testing phase: Not started

Proposed new deadline: June 15, 2024

Please let us know if this works with the overall project timeline.

Best regards,
Development Team`,
    confidence: 0.78,
    createdAt: "2024-05-10T16:12:45Z",
  },
  {
    id: "4",
    userId: "1",
    imageUrl: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg",
    extractedText: `INVOICE #INV-2024-0542

TechSolutions Inc.
123 Business Ave
San Francisco, CA 94105

Bill To:
Creative Agency LLC
456 Design Street
Los Angeles, CA 90210

Date: May 8, 2024
Due Date: June 7, 2024

Description                    Qty    Rate      Amount
Web Development Services        40    $125.00   $5,000.00
UI/UX Design Consultation      16    $150.00   $2,400.00
Project Management             20    $100.00   $2,000.00

                              Subtotal: $9,400.00
                                   Tax: $752.00
                                 Total: $10,152.00

Payment Terms: Net 30 days
Thank you for your business!`,
    confidence: 0.94,
    createdAt: "2024-05-08T11:30:15Z",
  },
  {
    id: "5",
    userId: "1",
    imageUrl: "https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg",
    extractedText: `Recipe: Chocolate Chip Cookies

Ingredients:
- 2¼ cups all-purpose flour
- 1 tsp baking soda
- 1 tsp salt
- 1 cup butter, softened
- ¾ cup granulated sugar
- ¾ cup brown sugar, packed
- 2 large eggs
- 2 tsp vanilla extract
- 2 cups chocolate chips

Instructions:
1. Preheat oven to 375°F (190°C)
2. Mix flour, baking soda, and salt in bowl
3. Cream butter and sugars until fluffy
4. Beat in eggs and vanilla
5. Gradually add flour mixture
6. Stir in chocolate chips
7. Drop rounded tablespoons on ungreased sheets
8. Bake 9-11 minutes until golden brown
9. Cool on baking sheet 2 minutes

Makes about 48 cookies
Prep time: 15 minutes
Bake time: 9-11 minutes per batch`,
    confidence: 0.89,
    createdAt: "2024-05-07T15:20:33Z",
  },
  {
    id: "6",
    userId: "1",
    imageUrl: "https://images.pexels.com/photos/4386339/pexels-photo-4386339.jpeg",
    extractedText: `PARKING TICKET

Citation #: PT-2024-789456
Date: May 6, 2024
Time: 2:45 PM
Location: Main St & 5th Ave

Vehicle Information:
License Plate: ABC-1234
State: California
Make: Honda
Model: Civic
Color: Blue

Violation: Expired Meter
Fine Amount: $35.00
Late Fee (after 30 days): $15.00

Payment Options:
• Online: www.cityparking.gov
• Phone: (555) 123-PARK
• Mail: City Parking Division
        PO Box 12345
        Anytown, CA 90210

Contest Deadline: June 5, 2024

Officer Badge #: 4567
Signature: [Officer Signature]`,
    confidence: 0.91,
    createdAt: "2024-05-06T14:45:12Z",
  },
  {
    id: "7",
    userId: "1",
    imageUrl: "https://images.pexels.com/photos/4386285/pexels-photo-4386285.jpeg",
    extractedText: `MEDICAL PRESCRIPTION

Dr. Emily Watson, MD
Family Medicine Clinic
789 Health Blvd, Suite 200
Wellness City, CA 90123
Phone: (555) 987-6543

Patient: Jennifer Smith
DOB: 03/15/1985
Date: May 5, 2024

Rx: Amoxicillin 500mg
Sig: Take 1 capsule by mouth 
     three times daily with food
     for 10 days

Qty: 30 capsules
Refills: 0

Generic substitution permitted

Dr. Emily Watson
License #: MD123456
DEA #: BW1234567

Pharmacy: Fill within 30 days
Patient: Complete full course even if feeling better`,
    confidence: 0.87,
    createdAt: "2024-05-05T10:15:45Z",
  },
  {
    id: "8",
    userId: "1",
    imageUrl: "https://images.pexels.com/photos/4386242/pexels-photo-4386242.jpeg",
    extractedText: `CONFERENCE AGENDA

Tech Innovation Summit 2024
May 4-5, 2024 | Convention Center

Day 1 - May 4th
9:00 AM - Registration & Coffee
9:30 AM - Opening Keynote: "The Future of AI"
          Speaker: Dr. Sarah Chen, MIT
10:30 AM - Break
11:00 AM - Panel: "Blockchain in Healthcare"
12:30 PM - Lunch & Networking
2:00 PM - Workshop: "Machine Learning Basics"
3:30 PM - Break
4:00 PM - Presentation: "Quantum Computing"
5:30 PM - Closing Remarks
6:00 PM - Welcome Reception

Day 2 - May 5th
9:00 AM - Morning Coffee
9:30 AM - Keynote: "Sustainable Technology"
10:30 AM - Breakout Sessions
12:00 PM - Awards Ceremony
1:00 PM - Closing Lunch

Registration: $299 (Early Bird: $199)
Contact: info@techinnovationsummit.com`,
    confidence: 0.93,
    createdAt: "2024-05-04T08:30:22Z",
  },
  {
    id: "9",
    userId: "1",
    imageUrl: "https://images.pexels.com/photos/4386198/pexels-photo-4386198.jpeg",
    extractedText: `BANK STATEMENT

First National Bank
Account Holder: Michael Johnson
Account Number: ****-****-****-5678
Statement Period: April 1-30, 2024

Beginning Balance: $2,847.32

DEPOSITS:
04/01  Direct Deposit - Salary      $3,200.00
04/15  Direct Deposit - Salary      $3,200.00
04/20  Mobile Deposit - Check       $125.50
Total Deposits: $6,525.50

WITHDRAWALS:
04/02  Rent Payment                 $1,200.00
04/05  Grocery Store                $87.43
04/08  Gas Station                  $45.20
04/12  Online Purchase              $156.78
04/18  Restaurant                   $42.15
04/25  ATM Withdrawal               $100.00
04/28  Utility Payment              $134.67
Total Withdrawals: $1,766.23

Ending Balance: $7,606.59

Service Charges: $0.00
Interest Earned: $0.00

Customer Service: 1-800-BANK-123`,
    confidence: 0.96,
    createdAt: "2024-05-03T13:45:18Z",
  },
  {
    id: "10",
    userId: "1",
    imageUrl: "https://images.pexels.com/photos/4386156/pexels-photo-4386156.jpeg",
    extractedText: `FLIGHT ITINERARY

Confirmation Code: ABC123
Passenger: Lisa Rodriguez

OUTBOUND FLIGHT
Date: May 20, 2024
Flight: AA 1234
Departure: Los Angeles (LAX) - 8:30 AM
Arrival: New York (JFK) - 4:45 PM
Seat: 12A (Window)
Class: Economy

RETURN FLIGHT  
Date: May 27, 2024
Flight: AA 5678
Departure: New York (JFK) - 6:15 PM
Arrival: Los Angeles (LAX) - 9:30 PM
Seat: 15C (Aisle)
Class: Economy

Baggage:
• 1 Carry-on included
• 1 Checked bag: $35.00

Total Cost: $487.50

Check-in: Available 24 hours before departure
Mobile boarding passes available
Arrive at airport 2 hours early for domestic flights

Customer Service: 1-800-433-7300
Manage booking: aa.com`,
    confidence: 0.88,
    createdAt: "2024-05-02T16:22:41Z",
  },
  {
    id: "11",
    userId: "1",
    imageUrl: "https://images.pexels.com/photos/4386112/pexels-photo-4386112.jpeg",
    extractedText: `RENTAL AGREEMENT

Property Address: 456 Oak Street, Apt 2B
                 Springfield, CA 90456

Landlord: Green Property Management
         123 Business Plaza
         Springfield, CA 90456
         Phone: (555) 234-5678

Tenant: Robert Kim
        Current Address: 789 Elm Ave
                        Riverside, CA 90210

Lease Term: 12 months
Start Date: June 1, 2024
End Date: May 31, 2025

Monthly Rent: $1,850.00
Security Deposit: $1,850.00
Pet Deposit: $300.00 (if applicable)

Rent Due: 1st of each month
Late Fee: $50.00 after 5th of month

Utilities Included: Water, Trash
Tenant Responsible: Electricity, Gas, Internet

Property Features:
• 2 bedrooms, 1 bathroom
• Parking space included
• Laundry in unit
• Pet-friendly (with deposit)

Both parties agree to terms and conditions
outlined in the full lease agreement.

Landlord Signature: ________________
Tenant Signature: ________________
Date: ________________`,
    confidence: 0.84,
    createdAt: "2024-05-01T12:10:55Z",
  },
  {
    id: "12",
    userId: "1",
    imageUrl: "https://images.pexels.com/photos/4386068/pexels-photo-4386068.jpeg",
    extractedText: `WORKOUT PLAN - Week 1

Monday - Upper Body
• Push-ups: 3 sets x 12 reps
• Pull-ups: 3 sets x 8 reps
• Dumbbell rows: 3 sets x 10 reps
• Shoulder press: 3 sets x 12 reps
• Bicep curls: 3 sets x 15 reps
• Tricep dips: 3 sets x 10 reps

Tuesday - Cardio
• 30 min treadmill (moderate pace)
• 15 min stationary bike
• 10 min rowing machine

Wednesday - Lower Body
• Squats: 4 sets x 15 reps
• Lunges: 3 sets x 12 each leg
• Deadlifts: 3 sets x 10 reps
• Calf raises: 3 sets x 20 reps
• Leg press: 3 sets x 15 reps

Thursday - Rest Day
• Light stretching
• 20 min walk

Friday - Full Body Circuit
• Burpees: 3 sets x 8 reps
• Mountain climbers: 3 sets x 20 reps
• Plank: 3 sets x 45 seconds
• Jumping jacks: 3 sets x 30 reps

Weekend - Active Recovery
• Yoga or hiking
• Swimming (optional)

Notes: Stay hydrated, warm up before each session,
cool down with stretching. Progress gradually.`,
    confidence: 0.9,
    createdAt: "2024-04-30T09:35:28Z",
  },
]

const uploadToCloudinary = async (file: File): Promise<string> => {
  const data = new FormData()
  data.append("file", file)
  data.append("upload_preset", "ProjetRL")
  data.append("cloud_name", "dxc5curxy")

  const response = await fetch("https://api.cloudinary.com/v1_1/dxc5curxy/image/upload", {
    method: "POST",
    body: data,
  })

  if (!response.ok) throw new Error("Échec de l'upload")

  const result = await response.json()
  if (result && result.url) return result.url
  else throw new Error("Réponse Cloudinary invalide")
}

const processImageFile = async (imageFile: File): Promise<ScanResult> => {
  if (!OCR_API_URL) throw new Error("OCR API URL not configured")
  const cloudinaryUrl = await uploadToCloudinary(imageFile)

  const formData = new FormData()
  formData.append("image", imageFile)

  const response = await fetch(OCR_API_URL, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) throw new Error("Failed to process image")

  const data = await response.json()

  return {
    id: data.id || Math.random().toString(36).substr(2, 9),
    userId: "1",
    imageUrl: cloudinaryUrl,
    extractedText: data.text || "",
    confidence: data.confidence || 0.75,
    createdAt: new Date().toISOString(),
  }
}

const processImageUrl = async (imageUrl: string): Promise<ScanResult> => {
  if (!OCR_API_URL) throw new Error("OCR API URL not configured")

  const response = await fetch(`${OCR_API_URL}/url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl }),
  })

  if (!response.ok) throw new Error("Failed to process image URL")

  const data = await response.json()

  return {
    id: data.id || Math.random().toString(36).substr(2, 9),
    userId: "1",
    imageUrl,
    extractedText: data.text || "",
    confidence: data.confidence || 0.75,
    createdAt: new Date().toISOString(),
  }
}

const calculateStats = (scans: ScanResult[]): DashboardStats => {
  const totalScans = scans.length
  const successfulScans = scans.filter((scan) => scan.confidence > 0.7).length
  const averageConfidence = scans.reduce((sum, scan) => sum + scan.confidence, 0) / (totalScans || 1)
  const recentScans = [...scans]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
  return { totalScans, successfulScans, averageConfidence, recentScans }
}

interface ScanContextType {
  scans: ScanResult[]
  isProcessing: boolean
  stats: DashboardStats
  processImage: (file: File | string) => Promise<ScanResult>
  uploadImage: (file: File) => Promise<string>
}

const ScanContext = createContext<ScanContextType | undefined>(undefined)

export const ScanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [scans, setScans] = useState<ScanResult[]>(mockScanResults)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleProcessImage = async (input: File | string): Promise<ScanResult> => {
    setIsProcessing(true)
    try {
      const result = typeof input === "string" ? await processImageUrl(input) : await processImageFile(input)
      setScans((prev) => [result, ...prev])
      return result
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ScanContext.Provider
      value={{
        scans,
        isProcessing,
        stats: calculateStats(scans),
        processImage: handleProcessImage,
        uploadImage: uploadToCloudinary,
      }}
    >
      {children}
    </ScanContext.Provider>
  )
}

export const useScan = (): ScanContextType => {
  const context = useContext(ScanContext)
  if (context === undefined) {
    throw new Error("useScan must be used within a ScanProvider")
  }
  return context
}

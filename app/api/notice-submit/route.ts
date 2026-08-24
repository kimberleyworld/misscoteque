import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"

// In-memory rate limiting store (IP address -> array of submission timestamps)
const submissionStore = new Map<string, number[]>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds
const MAX_SUBMISSIONS_PER_WINDOW = 5 // Allow 5 submissions per hour

// Sanitize input to prevent XSS attacks (remove HTML tags and scripts)
function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .trim()
}

// Get client IP address
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown"
  )
}

// Check rate limit
function checkRateLimit(ip: string): { allowed: boolean; remainingMs?: number } {
  const now = Date.now()
  const submissions = submissionStore.get(ip) || []

  // Remove submissions older than the rate limit window
  const recentSubmissions = submissions.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW)

  // Check if user has exceeded the limit
  if (recentSubmissions.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    const oldestSubmission = recentSubmissions[0]
    const remainingMs = RATE_LIMIT_WINDOW - (now - oldestSubmission)
    return { allowed: false, remainingMs }
  }

  // Add the current submission timestamp
  recentSubmissions.push(now)
  submissionStore.set(ip, recentSubmissions)
  return { allowed: true }
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit first
    const clientIp = getClientIp(request)
    const rateLimitCheck = checkRateLimit(clientIp)

    if (!rateLimitCheck.allowed) {
      const minutesRemaining = Math.ceil((rateLimitCheck.remainingMs || 0) / 60000)
      return NextResponse.json(
        { error: `You have reached the submission limit. Please try again in ${minutesRemaining} minute(s).` },
        { status: 429 }
      )
    }

    const data = await request.formData()
    let title = data.get("title")?.toString().trim() ?? ""
    let description = data.get("description")?.toString().trim() ?? ""
    let link = data.get("link")?.toString().trim() ?? ""
    let contactDetails = data.get("contactDetails")?.toString().trim() ?? ""

    // Sanitize all inputs
    title = sanitizeInput(title)
    description = sanitizeInput(description)
    link = sanitizeInput(link)
    contactDetails = sanitizeInput(contactDetails)

    // Validate input lengths to prevent abuse
    if (title.length > 200) {
      return NextResponse.json(
        { error: "Title must be less than 200 characters" },
        { status: 400 }
      )
    }
    if (description.length > 2000) {
      return NextResponse.json(
        { error: "Description must be less than 2000 characters" },
        { status: 400 }
      )
    }
    if (contactDetails.length > 500) {
      return NextResponse.json(
        { error: "Contact details must be less than 500 characters" },
        { status: 400 }
      )
    }

    if (!title || !description || !contactDetails) {
      return NextResponse.json(
        { error: "Title, description, and contact details are required" },
        { status: 400 }
      )
    }

    const communityNotice = await prisma.communityNotice.create({
      data: {
        title,
        description,
        link: link || null,
        contactDetails,
        isApproved: false,
        isActive: true,
      },
    })

    // Send email notification via Resend
    try {
      const resendApiKey = process.env.RESEND_API_KEY
      const adminEmail = process.env.ADMIN_EMAIL || "wnbdiscocollective@gmail.com"

      if (resendApiKey) {
        const resend = new Resend(resendApiKey)
        
        const emailResult = await resend.emails.send({
          from: "notification@misscoteque.world",
          to: adminEmail,
          subject: `New Community Notice: ${title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>New Community Notice Submitted</h2>
              <p><strong>Title:</strong> ${title}</p>
              <p><strong>Description:</strong> ${description}</p>
              <hr />
              <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin">Review in Admin Panel</a></p>
            </div>
          `,
        })
        
        if (emailResult.error) {
          console.error("Resend API error:", emailResult.error)
        } else {
          console.log("Email sent successfully:", emailResult.data)
        }
      }
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      // Don't fail the submission if email fails
    }

    return NextResponse.json(
      {
        success: true,
        notice: communityNotice,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Notice submission error:", error)

    return NextResponse.json(
      { error: "Failed to submit notice. Please try again later." },
      { status: 500 }
    )
  }
}

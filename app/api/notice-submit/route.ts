import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// In-memory rate limiting store (IP address -> last submission timestamp)
const submissionStore = new Map<string, number>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds

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
  const lastSubmission = submissionStore.get(ip)

  if (!lastSubmission) {
    submissionStore.set(ip, now)
    return { allowed: true }
  }

  const timeSinceLastSubmission = now - lastSubmission
  if (timeSinceLastSubmission < RATE_LIMIT_WINDOW) {
    const remainingMs = RATE_LIMIT_WINDOW - timeSinceLastSubmission
    return { allowed: false, remainingMs }
  }

  // Update the timestamp for this IP
  submissionStore.set(ip, now)
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
        { error: `Too many submissions. Please try again in ${minutesRemaining} minute(s).` },
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

    // Send notification via Zapier webhook
    try {
      const zapierWebhookUrl = process.env.ZAPIER_WEBHOOK_URL
      if (zapierWebhookUrl) {
        await fetch(zapierWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            contactDetails,
            submittedAt: new Date().toISOString(),
            adminLink: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin`,
          }),
        })
      }
    } catch (webhookError) {
      console.error("Failed to trigger Zapier webhook:", webhookError)
      // Don't fail the submission if webhook fails
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

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"

// In-memory rate limiting store (IP address -> array of submission timestamps)
const submissionStore = new Map<string, number[]>()
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
const MAX_UPLOADS_PER_WINDOW = 5 // Allow 5 uploads per 24 hours

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
  if (recentSubmissions.length >= MAX_UPLOADS_PER_WINDOW) {
    const oldestSubmission = recentSubmissions[0]
    const remainingMs = RATE_LIMIT_WINDOW - (now - oldestSubmission)
    return { allowed: false, remainingMs }
  }

  // Add the current submission timestamp
  recentSubmissions.push(now)
  submissionStore.set(ip, recentSubmissions)
  return { allowed: true }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit first
    const clientIp = getClientIp(request)
    const rateLimitCheck = checkRateLimit(clientIp)

    if (!rateLimitCheck.allowed) {
      const hoursRemaining = Math.ceil((rateLimitCheck.remainingMs || 0) / (60 * 60 * 1000))
      return NextResponse.json(
        { error: `Too many uploads. Please try again in ${hoursRemaining} hour(s).` },
        { status: 429 }
      )
    }

    const data = await request.formData()
    let title = data.get("title")?.toString().trim() ?? ""
    let description = data.get("description")?.toString().trim() ?? ""
    let content = data.get("content")?.toString().trim() ?? ""
    let manualUrl = data.get("URL")?.toString().trim() ?? ""
    const eventDateRaw = data.get("eventDate")?.toString().trim() ?? ""
    const fileEntry = data.get("file")
    const file = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null

    // Sanitize all inputs
    title = sanitizeInput(title)
    description = sanitizeInput(description)
    content = sanitizeInput(content)
    manualUrl = sanitizeInput(manualUrl)

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
    if (content.length > 5000) {
      return NextResponse.json(
        { error: "Content must be less than 5000 characters" },
        { status: 400 }
      )
    }

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    let fileData: Buffer | null = null
    let fileName: string | null = null
    let fileMimeType: string | null = null
    let fileSize: number | null = null

    if (file) {
      const maxImageSize = 2 * 1024 * 1024
      const maxAudioSize = 5 * 1024 * 1024
      const maxPdfSize = 10 * 1024 * 1024

      const mimeType = file.type.toLowerCase()
      let maxSize: number
      let subfolder: "images" | "audio" | "pdfs"

      if (mimeType.startsWith("image/")) {
        maxSize = maxImageSize
        subfolder = "images"
      } else if (mimeType.startsWith("audio/")) {
        maxSize = maxAudioSize
        subfolder = "audio"
      } else if (mimeType === "application/pdf") {
        maxSize = maxPdfSize
        subfolder = "pdfs"
      } else {
        return NextResponse.json(
          { error: "Unsupported file type. Allowed: image/*, audio/*, .pdf" },
          { status: 400 }
        )
      }

      if (file.size > maxSize) {
        const maxSizeMB = Math.round(maxSize / (1024 * 1024))
        return NextResponse.json(
          {
            error: `File too large. Max size is ${maxSizeMB}MB for ${subfolder}`,
          },
          { status: 400 }
        )
      }

      const arrayBuffer = await file.arrayBuffer()
      fileData = Buffer.from(arrayBuffer)
      fileName = file.name
      fileMimeType = mimeType
      fileSize = file.size

      // Files are stored in the database
    }

    const baseSlug = generateSlug(title)
    let slug = baseSlug
    let counter = 1

    while (await prisma.archive.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const createData = {
      title,
      description,
      content,
      slug,
      URL: manualUrl || null,
      fileData,
      fileName,
      fileMimeType,
      fileSize,
      eventDate: eventDateRaw ? new Date(eventDateRaw) : null,
      isPublished: true,
      isApproved: false,
    }

    const archiveCreate = (prisma.archive as unknown as {
      create: (args: { data: unknown }) => Promise<{
        id: string
        slug: string | null
        URL: string | null
      }>
    }).create

    const archiveEntry = await archiveCreate({
      data: createData as never,
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
          subject: `New Archive Submission: ${title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>New Archive Item Submitted</h2>
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
      console.error("Failed to send archive email notification:", emailError)
      // Don't fail the submission if email fails
    }

    return NextResponse.json(
      {
        message: "Archive entry created successfully",
        id: archiveEntry.id,
        slug: archiveEntry.slug,
        URL: archiveEntry.URL,
        storedInDatabase: Boolean(fileData),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Archive upload error:", error)

    return NextResponse.json(
      { error: "Failed to upload archive entry. Please try again later." },
      { status: 500 }
    )
  }
}

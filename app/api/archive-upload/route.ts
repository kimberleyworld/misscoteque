import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { prisma } from "@/lib/prisma"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET_NAME = "archive-assets"

// In-memory rate limiting store (IP address -> last submission timestamp)
const submissionStore = new Map<string, number>()
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000 // 24 hours in milliseconds (stricter for uploads)

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

function getSupabaseClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables"
    )
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey)
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

    let uploadedUrl: string | null = null
    let fileData: Buffer | null = null
    let fileName: string | null = null
    let fileMimeType: string | null = null
    let fileSize: number | null = null
    let uploadWarning: string | null = null

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

      if (supabaseUrl && supabaseServiceRoleKey) {
        const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin"
        const uniquePart = Math.random().toString(36).slice(2, 8)
        const filename = `${subfolder}/${Date.now()}_${uniquePart}.${extension}`

        const supabase = getSupabaseClient()

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filename, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: mimeType,
          })

        if (uploadError) {
          uploadWarning = `Storage upload failed: ${uploadError.message}`
        } else {
          const {
            data: { publicUrl },
          } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filename)

          uploadedUrl = publicUrl
        }
      } else {
        uploadWarning =
          "Supabase storage env vars missing; file saved in database only."
      }
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
      URL: uploadedUrl ?? (manualUrl || null),
      fileData,
      fileName,
      fileMimeType,
      fileSize,
      eventDate: eventDateRaw ? new Date(eventDateRaw) : null,
      isPublished: true,
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

    return NextResponse.json(
      {
        message: "Archive entry created successfully",
        id: archiveEntry.id,
        slug: archiveEntry.slug,
        URL: archiveEntry.URL,
        storedInDatabase: Boolean(fileData),
        uploadWarning,
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

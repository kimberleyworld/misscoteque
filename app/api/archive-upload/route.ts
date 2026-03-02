import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { prisma } from "@/lib/prisma"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET_NAME = "archive-assets"

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
    const data = await request.formData()
    const title = data.get("title")?.toString().trim() ?? ""
    const description = data.get("description")?.toString().trim() ?? ""
    const content = data.get("content")?.toString().trim() ?? ""
    const manualUrl = data.get("URL")?.toString().trim() ?? ""
    const eventDateRaw = data.get("eventDate")?.toString().trim() ?? ""
    const fileEntry = data.get("file")
    const file = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null

    if (!title || !description || !content) {
      return NextResponse.json(
        { error: "Title, description, and content are required" },
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
      {
        error: error instanceof Error ? error.message : "Failed to upload file",
      },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const title = data.get("title")?.toString().trim() ?? ""
    const description = data.get("description")?.toString().trim() ?? ""
    const link = data.get("link")?.toString().trim() ?? ""
    const contactDetails = data.get("contactDetails")?.toString().trim() ?? ""

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

    return NextResponse.json(
      {
        success: true,
        notice: communityNotice,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Notice submission error:", error)

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to submit notice",
          details: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Failed to submit notice" },
      { status: 500 }
    )
  }
}

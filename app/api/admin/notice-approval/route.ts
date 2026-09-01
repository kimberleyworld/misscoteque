import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

interface UpdateApprovalRequest {
  itemId: string
  itemType: "notice" | "archive"
  approved: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UpdateApprovalRequest
    const { itemId, itemType, approved } = body

    if (!itemId || !itemType) {
      return NextResponse.json(
        { error: "Item ID and type are required" },
        { status: 400 }
      )
    }

    let updatedItem

    if (itemType === "notice") {
      if (approved) {
        updatedItem = await prisma.communityNotice.update({
          where: { id: itemId },
          data: { isApproved: true },
        })
      } else {
        // Delete rejected notices
        await prisma.communityNotice.delete({
          where: { id: itemId },
        })
        updatedItem = null
      }
    } else if (itemType === "archive") {
      if (approved) {
        updatedItem = await prisma.archive.update({
          where: { id: itemId },
          data: { isApproved: true },
        })
      } else {
        // Delete rejected archives
        await prisma.archive.delete({
          where: { id: itemId },
        })
        updatedItem = null
      }
    } else {
      return NextResponse.json(
        { error: "Invalid item type" },
        { status: 400 }
      )
    }

    // Revalidate pages that show approved content
    revalidatePath("/")
    revalidatePath("/artifacts")

    return NextResponse.json(
      {
        success: true,
        item: updatedItem,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating item:", error)

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to update item",
          details: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    )
  }
}

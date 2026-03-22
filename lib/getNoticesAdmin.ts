import { prisma } from "@/lib/prisma"

export async function getPendingNotices() {
  try {
    const notices = await prisma.communityNotice.findMany({
      where: {
        isApproved: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return notices
  } catch (error) {
    console.error("Error fetching pending notices:", error)
    return []
  }
}

export async function getApprovedNotices() {
  try {
    const notices = await prisma.communityNotice.findMany({
      where: {
        isApproved: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return notices
  } catch (error) {
    console.error("Error fetching approved notices:", error)
    return []
  }
}

export async function getPendingArchive() {
  try {
    const archives = await prisma.archive.findMany({
      where: {
        isApproved: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return archives
  } catch (error) {
    console.error("Error fetching pending archive:", error)
    return []
  }
}

export async function getApprovedArchive() {
  try {
    const archives = await prisma.archive.findMany({
      where: {
        isApproved: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return archives
  } catch (error) {
    console.error("Error fetching approved archive:", error)
    return []
  }
}

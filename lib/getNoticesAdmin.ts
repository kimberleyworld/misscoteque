import { prisma } from "@/lib/prisma"
import { getMockArchives } from "@/lib/mockArchiveData"
import { getMockCommunityNotices } from "@/lib/mockCommunityNotices"

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
    // Return empty for pending since mock data is all approved
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

    // If no notices found, return mock data
    if (notices.length === 0) {
      return getMockCommunityNotices()
    }

    return notices
  } catch (error) {
    console.error("Error fetching approved notices:", error)
    // Return mock data when database is unavailable
    return getMockCommunityNotices()
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
    // Return empty for pending since mock data is approved
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
    // Return mock data when database is unavailable
    return getMockArchives()
  }
}

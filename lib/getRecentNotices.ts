import { prisma } from "@/lib/prisma"
import { getMockRecentNotices } from "@/lib/mockCommunityNotices"

export async function getRecentNotices() {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const notices = await prisma.communityNotice.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
        isApproved: true,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // If no notices found, return mock data
    if (notices.length === 0) {
      return getMockRecentNotices()
    }

    return notices
  } catch (error) {
    console.error("Error fetching recent notices:", error)
    console.log("Using mock notices as fallback")
    return getMockRecentNotices()
  }
}

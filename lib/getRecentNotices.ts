import { prisma } from "@/lib/prisma"

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

    return notices
  } catch (error) {
    console.error("Error fetching recent notices:", error)
    return []
  }
}

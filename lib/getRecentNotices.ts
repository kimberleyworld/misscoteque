import { prisma } from "@/lib/prisma"

export async function getRecentNotices() {
  const fourWeeksAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)

  const notices = await prisma.communityNotice.findMany({
    where: {
      createdAt: {
        gte: fourWeeksAgo,
      },
      isApproved: true,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return notices
}

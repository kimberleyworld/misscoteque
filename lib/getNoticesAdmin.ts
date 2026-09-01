import { prisma } from "@/lib/prisma"

export async function getPendingNotices() {
  const notices = await prisma.communityNotice.findMany({
    where: {
      approvalStatus: "PENDING",
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return notices
}

export async function getApprovedNotices() {
  const notices = await prisma.communityNotice.findMany({
    where: {
      approvalStatus: "APPROVED",
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return notices
}

export async function getPendingArchive() {
  const archives = await prisma.archive.findMany({
    where: {
      approvalStatus: "PENDING",
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return archives
}

export async function getApprovedArchive() {
  const archives = await prisma.archive.findMany({
    where: {
      approvalStatus: "APPROVED",
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return archives
}

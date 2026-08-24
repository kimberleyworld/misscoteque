import {
  getPendingNotices,
  getApprovedNotices,
  getPendingArchive,
  getApprovedArchive,
} from "@/lib/getNoticesAdmin"
import { AdminPasswordPage } from "@/app/components/admin-password-page"
import type { Archive } from "@prisma/client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminPage() {
  const [pendingNotices, approvedNotices, pendingArchive, approvedArchive] =
    await Promise.all([
      getPendingNotices(),
      getApprovedNotices(),
      getPendingArchive(),
      getApprovedArchive(),
    ])

  // Remove fileData (Bytes) from archives to avoid serialization issues
  const serializedData = {
    pendingNotices: pendingNotices,
    approvedNotices: approvedNotices,
    pendingArchive: pendingArchive.map(({ fileData, ...rest }: Archive) => rest),
    approvedArchive: approvedArchive.map(({ fileData, ...rest }: Archive) => rest),
  }

  return (
    <AdminPasswordPage
      pendingNotices={serializedData.pendingNotices}
      approvedNotices={serializedData.approvedNotices}
      pendingArchive={serializedData.pendingArchive}
      approvedArchive={serializedData.approvedArchive}
    />
  )
}

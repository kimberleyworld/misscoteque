import {
  getPendingNotices,
  getApprovedNotices,
  getPendingArchive,
  getApprovedArchive,
} from "@/lib/getNoticesAdmin"
import { AdminPasswordPage } from "@/app/components/admin-password-page"

export default async function AdminPage() {
  const [pendingNotices, approvedNotices, pendingArchive, approvedArchive] =
    await Promise.all([
      getPendingNotices(),
      getApprovedNotices(),
      getPendingArchive(),
      getApprovedArchive(),
    ])

  return (
    <AdminPasswordPage
      pendingNotices={pendingNotices}
      approvedNotices={approvedNotices}
      pendingArchive={pendingArchive}
      approvedArchive={approvedArchive}
    />
  )
}

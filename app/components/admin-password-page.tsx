"use client"

import { useState } from "react"
import { AdminModeration } from "@/app/components/layout/admin-moderation"
import { AdminPassword } from "@/app/components/admin-password"

interface AdminPasswordPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pendingNotices: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  approvedNotices: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pendingArchive: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  approvedArchive: any[]
}

export function AdminPasswordPage({
  pendingNotices,
  approvedNotices,
  pendingArchive,
  approvedArchive,
}: AdminPasswordPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if password cookie exists on initial mount
    if (typeof document === "undefined") return false
    const adminAuth = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin_auth="))
    return !!adminAuth
  })

  if (!isAuthenticated) {
    return <AdminPassword onSuccess={() => setIsAuthenticated(true)} />
  }

  return (
    <main className="min-h-screen bg-cream text-black">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-red font-impact text-4xl mb-2">Moderation Center</h1>
            <p className="text-black/60">
              Review and approve community notices and archive entries
            </p>
          </div>
        </div>

        <AdminModeration
          pendingNotices={pendingNotices}
          approvedNotices={approvedNotices}
          pendingArchive={pendingArchive}
          approvedArchive={approvedArchive}
        />
      </div>
    </main>
  )
}

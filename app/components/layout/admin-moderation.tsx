"use client"

import * as React from "react"
import { Button } from "@/app/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/app/components/ui/card"
import { toast } from "sonner"

interface Notice {
  id: string
  title: string
  description: string | null
  contactDetails: string | null
  link: string | null
  isApproved: boolean
  isActive: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

interface ArchiveEntry {
  id: string
  title: string
  description: string | null
  content: string | null
  URL: string | null
  fileName: string | null
  isApproved: boolean
  isPublished: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

interface AdminModerationProps {
  pendingNotices: Notice[]
  approvedNotices: Notice[]
  pendingArchive: ArchiveEntry[]
  approvedArchive: ArchiveEntry[]
}

export function AdminModeration({
  pendingNotices,
  approvedNotices,
  pendingArchive,
  approvedArchive,
}: AdminModerationProps) {
  const [notices, setNotices] = React.useState({
    pending: pendingNotices,
    approved: approvedNotices,
  })
  const [archives, setArchives] = React.useState({
    pending: pendingArchive,
    approved: approvedArchive,
  })
  const [loading, setLoading] = React.useState<string | null>(null)

  const approve = async (itemId: string, itemType: "notice" | "archive") => {
    setLoading(`${itemType}-${itemId}`)
    try {
      const response = await fetch("/api/admin/notice-approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, itemType, approved: true }),
      })

      if (!response.ok) throw new Error("Failed to approve")

      const data = await response.json()

      if (itemType === "notice") {
        setNotices((prev) => ({
          pending: prev.pending.filter((n) => n.id !== itemId),
          approved: [data.item, ...prev.approved],
        }))
      } else {
        setArchives((prev) => ({
          pending: prev.pending.filter((a) => a.id !== itemId),
          approved: [data.item, ...prev.approved],
        }))
      }

      toast("Item approved! ✓", { position: "bottom-right" })
    } catch (error) {
      toast("Failed to approve", { position: "bottom-right" })
    } finally {
      setLoading(null)
    }
  }

  const reject = async (itemId: string, itemType: "notice" | "archive") => {
    setLoading(`${itemType}-${itemId}`)
    try {
      const response = await fetch("/api/admin/notice-approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, itemType, approved: false }),
      })

      if (!response.ok) throw new Error("Failed to reject")

      if (itemType === "notice") {
        setNotices((prev) => ({
          ...prev,
          pending: prev.pending.filter((n) => n.id !== itemId),
        }))
      } else {
        setArchives((prev) => ({
          ...prev,
          pending: prev.pending.filter((a) => a.id !== itemId),
        }))
      }

      toast("Item rejected", { position: "bottom-right" })
    } catch (error) {
      toast("Failed to reject", { position: "bottom-right" })
    } finally {
      setLoading(null)
    }
  }

  const ItemCard = ({
    title,
    description,
    details,
    id,
    type,
    createdAt,
  }: {
    title: string
    description: string | null
    details?: React.ReactNode
    id: string
    type: "notice" | "archive"
    createdAt: Date | string
  }) => (
    <Card className="bg-cream/5 border-black rounded-none">
      <CardHeader>
        <h3 className="text-black font-bold text-lg">{title}</h3>
        <CardDescription className="text-black/70">
          {new Date(createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {description && <p className="text-black/80">{description}</p>}
        {details && <div className="text-black/70 text-sm">{details}</div>}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => approve(id, type)}
            disabled={loading === `${type}-${id}`}
            className="bg-pink hover:bg-pink/90 text-black"
          >
            {loading === `${type}-${id}` ? "Approving..." : "Approve"}
          </Button>
          <Button
            onClick={() => reject(id, type)}
            disabled={loading === `${type}-${id}`}
            variant="outline"
            className="border-black text-black hover:bg-black"
          >
            {loading === `${type}-${id}` ? "Rejecting..." : "Reject"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-12">
      {/* Community Notices */}
      <div>
        <h2 className="text-black font-impact text-3xl mb-4">
          Community Notices
        </h2>
        <div className="space-y-8">
          {/* Pending */}
          <div>
            <h3 className="text-black font-bold text-lg mb-3">
              Pending ({notices.pending.length})
            </h3>
            {notices.pending.length === 0 ? (
              <p className="text-black/60">No pending notices</p>
            ) : (
              <div className="space-y-4">
                {notices.pending.map((notice) => (
                  <ItemCard
                    key={notice.id}
                    id={notice.id}
                    type="notice"
                    title={notice.title}
                    description={notice.description}
                    createdAt={notice.createdAt}
                    details={
                      <div className="space-y-1">
                        {notice.contactDetails && (
                          <p>
                            <span className="font-semibold">Contact:</span>{" "}
                            {notice.contactDetails}
                          </p>
                        )}
                        {notice.link && (
                          <p>
                            <a
                              href={notice.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-black underline"
                            >
                              {notice.link}
                            </a>
                          </p>
                        )}
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Approved */}
          <div>
            <h3 className="text-black font-bold text-lg mb-3">
              Approved ({notices.approved.length})
            </h3>
            {notices.approved.length === 0 ? (
              <p className="text-black/60">No approved notices</p>
            ) : (
              <div className="space-y-3">
                {notices.approved.map((notice) => (
                  <Card
                    key={notice.id}
                    className="bg-cream/5 border-black rounded-none"
                  >
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="text-black font-bold">{notice.title}</h4>
                          <p className="text-black/70 text-sm">
                            {new Date(notice.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-black bg-black/10 px-2 py-1 rounded">
                          Approved
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Archive Entries */}
      <div>
        <h2 className="text-black font-impact text-3xl mb-4">
          Archive Entries
        </h2>
        <div className="space-y-8">
          {/* Pending */}
          <div>
            <h3 className="text-black font-bold text-lg mb-3">
              Pending ({archives.pending.length})
            </h3>
            {archives.pending.length === 0 ? (
              <p className="text-black/60">No pending archive entries</p>
            ) : (
              <div className="space-y-4">
                {archives.pending.map((archive) => (
                  <ItemCard
                    key={archive.id}
                    id={archive.id}
                    type="archive"
                    title={archive.title}
                    description={archive.description}
                    createdAt={archive.createdAt}
                    details={
                      <div className="space-y-1">
                        {archive.content && (
                          <p className="line-clamp-2">
                            <span className="font-semibold">Content:</span>{" "}
                            {archive.content}
                          </p>
                        )}
                        {archive.URL && (
                          <p>
                            <a
                              href={archive.URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-black underline"
                            >
                              {archive.URL}
                            </a>
                          </p>
                        )}
                        {archive.fileName && (
                          <p>
                            <span className="font-semibold">File:</span>{" "}
                            {archive.fileName}
                          </p>
                        )}
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Approved */}
          <div>
            <h3 className="text-black font-bold text-lg mb-3">
              Approved ({archives.approved.length})
            </h3>
            {archives.approved.length === 0 ? (
              <p className="text-black/60">No approved archive entries</p>
            ) : (
              <div className="space-y-3">
                {archives.approved.map((archive) => (
                  <Card
                    key={archive.id}
                    className="bg-cream/5 border-black rounded-none"
                  >
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="text-black font-bold">
                            {archive.title}
                          </h4>
                          <p className="text-black/70 text-sm">
                            {new Date(archive.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-black bg-black/10 px-2 py-1 rounded">
                          Approved
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

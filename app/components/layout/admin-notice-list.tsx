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
  description: string
  contactDetails: string | null
  link: string | null
  approvalStatus: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface AdminNoticeListProps {
  initialPending: Notice[]
  initialApproved: Notice[]
}

export function AdminNoticeList({
  initialPending,
  initialApproved,
}: AdminNoticeListProps) {
  const [pending, setPending] = React.useState(initialPending)
  const [approved, setApproved] = React.useState(initialApproved)
  const [loading, setLoading] = React.useState<string | null>(null)

  const handleApprove = async (noticeId: string) => {
    setLoading(noticeId)
    try {
      const response = await fetch("/api/admin/notice-approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noticeId, approved: true }),
      })

      if (!response.ok) {
        throw new Error("Failed to approve notice")
      }

      const data = await response.json()
      const notice = data.notice

      setPending((prev) => prev.filter((n) => n.id !== noticeId))
      setApproved((prev) => [notice, ...prev])

      toast("Notice approved! ✓", {
        position: "bottom-right",
      })
    } catch (error) {
      console.error(error)
      toast("Failed to approve notice", {
        position: "bottom-right",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async (noticeId: string) => {
    setLoading(noticeId)
    try {
      const response = await fetch("/api/admin/notice-approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noticeId, approved: false }),
      })

      if (!response.ok) {
        throw new Error("Failed to reject notice")
      }

      setPending((prev) => prev.filter((n) => n.id !== noticeId))

      toast("Notice rejected", {
        position: "bottom-right",
      })
    } catch (error) {
      console.error(error)
      toast("Failed to reject notice", {
        position: "bottom-right",
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Pending Notices */}
      <div>
        <h2 className="text-pink font-impact text-2xl mb-4">
          Pending Approval ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-black/60">No pending notices</p>
        ) : (
          <div className="space-y-4">
            {pending.map((notice) => (
              <Card
                key={notice.id}
                className="bg-cream/5 border-orange/30 rounded-none"
              >
                <CardHeader>
                  <h3 className="text-black font-bold text-lg">
                    {notice.title}
                  </h3>
                  <CardDescription className="text-black/70">
                    {new Date(notice.createdAt).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-black/80">{notice.description}</p>

                  <div className="text-black/70 text-sm space-y-1">
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
                          className="text-pink underline hover:text-pink/80"
                        >
                          {notice.link}
                        </a>
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => handleApprove(notice.id)}
                      disabled={loading === notice.id}
                      className="bg-pink hover:bg-pink/90 text-black"
                    >
                      {loading === notice.id ? "Approving..." : "Approve"}
                    </Button>
                    <Button
                      onClick={() => handleReject(notice.id)}
                      disabled={loading === notice.id}
                      variant="outline"
                      className="border-orange/30 text-black hover:bg-orange/10"
                    >
                      {loading === notice.id ? "Rejecting..." : "Reject"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Approved Notices */}
      <div>
        <h2 className="text-pink font-impact text-2xl mb-4">
          Approved ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="text-black/60">No approved notices</p>
        ) : (
          <div className="space-y-3">
            {approved.map((notice) => (
              <Card key={notice.id} className="bg-cream/5 border-pink/30 rounded-none">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-black font-bold">{notice.title}</h3>
                      <p className="text-black/70 text-sm">
                        {new Date(notice.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-pink bg-pink/10 px-2 py-1 rounded">
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
  )
}

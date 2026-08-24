"use client"

import { useState } from "react"
import { CommunityNoticeForm } from "./notice-form"
import { ArchiveForm } from "./archive-form"
import { Modal } from "../ui/modal"
import { Button } from "../ui/button"

interface FormsModalProps {
  showNotice?: boolean
  showArchive?: boolean
  className?: string
}

export function FormsModal({ showNotice = true, showArchive = true, className }: FormsModalProps) {
  const [activeModal, setActiveModal] = useState<"notice" | "archive" | null>(null)

  return (
    <>
      <div className={`flex flex-col gap-4 justify-center items-center ${className || ""}`}>
        {showNotice && (
          <Button
            onClick={() => setActiveModal("notice")}
          >
            SUBMIT
          </Button>
        )}
        {showArchive && (
          <Button
            onClick={() => setActiveModal("archive")}
            variant="outlineDark"
          >
            ADD TO ARCHIVE
          </Button>
        )}
      </div>

      <Modal isOpen={activeModal === "notice"} onClose={() => setActiveModal(null)}>
        <CommunityNoticeForm onSuccess={() => setActiveModal(null)} />
      </Modal>

      <Modal isOpen={activeModal === "archive"} onClose={() => setActiveModal(null)}>
        <ArchiveForm onSuccess={() => setActiveModal(null)} />
      </Modal>
    </>
  )
}

"use client"

import { useState } from "react"
import { CommunityNoticeForm } from "./notice-form"
import { ArchiveForm } from "./archive-form"
import { Button } from "../ui/button"

interface FormsModalProps {
  showNotice?: boolean
  showArchive?: boolean
}

export function FormsModal({ showNotice = true, showArchive = true }: FormsModalProps) {
  const [activeModal, setActiveModal] = useState<"notice" | "archive" | null>(null)

  return (
    <>
      {/* Buttons */}
      <div className="flex flex-col gap-4 justify-center items-center w-full">
        {showNotice && (
          <Button
            onClick={() => setActiveModal("notice")}
            className="bg-black hover:bg-black/60 text-cream font-impact rounded-none w-full cursor-pointer"
          >
            SUBMIT A NOTICE
          </Button>
        )}
        {showArchive && (
          <Button
            onClick={() => setActiveModal("archive")}
            className="bg-black hover:bg-black/60 text-cream font-impact rounded-none w-full cursor-pointer"
          >
            UPLOAD TO ARCHIVE
          </Button>
        )}
      </div>

      {/* Modal Backdrop and Content */}
      {activeModal && (
        <div
          className="fixed inset-0 bg-black/50 z-[600] flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-black hover:text-gray-700 text-2xl z-[601]"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Form Content */}
            <div className="p-8">
              {activeModal === "notice" && <CommunityNoticeForm />}
              {activeModal === "archive" && <ArchiveForm />}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

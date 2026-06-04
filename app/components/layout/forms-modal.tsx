"use client"

import { useState } from "react"
import { CommunityNoticeForm } from "./notice-form"
import { ArchiveForm } from "./archive-form"
import { Button } from "../ui/button"

export function FormsModal() {
  const [activeModal, setActiveModal] = useState<"notice" | "archive" | null>(null)

  return (
    <>
      {/* Buttons */}
      <div className="flex flex-col gap-4 justify-center items-center mb-12">
        <Button
          onClick={() => setActiveModal("notice")}
          className="bg-pink hover:bg-pink/90 text-black font-impact rounded-none"
        >
          Submit a Notice
        </Button>
        <Button
          onClick={() => setActiveModal("archive")}
          className="bg-pink hover:bg-pink/90 text-black font-impact rounded-none"
        >
          Upload to Archive
        </Button>
      </div>

      {/* Modal Backdrop and Content */}
      {activeModal && (
        <div
          className="fixed inset-0 bg-black/50 z-[600] flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
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

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-md z-[999] flex flex-col items-center justify-start pt-8 p-4 overflow-hidden"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:w-3/5 max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="sticky top-0 right-0 text-cream hover:text-cream/80 text-2xl z-[601] float-right mb-2 pr-2"
          aria-label="Close modal"
        >
          ✕
        </button>
        <div className="pb-8">{children}</div>
      </div>
    </div>
  )
}

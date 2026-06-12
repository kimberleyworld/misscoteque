interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-md z-[999] flex items-start justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:w-3/5 sm:max-h-[90vh] max-h-[100vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cream hover:text-cream/80 text-2xl z-[601]"
          aria-label="Close modal"
        >
          ✕
        </button>
        <div className="overflow-y-auto scrollbar-hide">{children}</div>
      </div>
    </div>
  )
}

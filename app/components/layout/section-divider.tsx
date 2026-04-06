interface SectionDividerProps {
  heading: string
}

export function SectionDivider({ heading }: SectionDividerProps) {
  return (
    <div className="w-full bg-black flex items-center justify-center">
      <h2 className="text-lg md:text-xl font-impact text-cream text-center">
        {heading}
      </h2>
    </div>
  )
}

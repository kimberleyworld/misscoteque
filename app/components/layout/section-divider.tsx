interface SectionDividerProps {
  heading: string
  variant?: "default" | "small"
}

export function SectionDivider({ heading, variant = "default" }: SectionDividerProps) {
  const isSmall = variant === "small"
  
  return (
    <div className={`${isSmall ? "bg-black hover:bg-black/60" : "bg-red"} w-full  flex items-center justify-center`}>
      <h2 className={`${isSmall ? "text-xs p-1" : "text-lg md:text-xl py-1 px-4"} font-impact text-cream text-center`}>
        {heading}
      </h2>
    </div>
  )
}
